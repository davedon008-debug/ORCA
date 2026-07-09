"use client";

import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { PackageSearch, Users, ListOrdered, BarChart3, Plus, Trash2, Edit, Bell, X, CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import api, { getBackendUrl } from '../../utils/axiosInstance';
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalUsers: 0 });
  const [isFetching, setIsFetching] = useState(true);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const notifPanelRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Product Form/Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Living Room');
  const [countInStock, setCountInStock] = useState(10);
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const authOptions = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      };
      const { data } = await api.post('/api/upload', formData, authOptions);
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  // Connect to socket and listen for new orders
  useEffect(() => {
    if (!user?.isAdmin) return;
    const socket = io(getBackendUrl());

    socket.on('new_order', (order) => {
      setNotifications((prev) => [
        { ...order, read: false, receivedAt: new Date().toISOString() },
        ...prev,
      ]);
      // Play a subtle audio cue if possible
      try { new Audio('/notification.mp3').play(); } catch (_) {}
    });

    return () => socket.disconnect();
  }, [user?.isAdmin]);

  // Close notif panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setIsNotifPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/');
      else if (!user.isAdmin) router.push('/dashboard');
      else fetchAdminData();
    }
  }, [user, loading]);

  const fetchAdminData = async () => {
    setIsFetching(true);
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      
      const resOrders = await api.get('/api/orders', authOptions);
      const resProducts = await api.get('/api/products');
      const resUsers = await api.get('/api/users', authOptions);
      
      setOrders(resOrders.data);
      setProducts(resProducts.data.products || []);
      setUsersList(resUsers.data);
      
      const resCategories = await api.get('/api/categories');
      setApiCategories(resCategories.data);
      
      const sales = resOrders.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
      setStats({
        totalSales: sales,
        totalOrders: resOrders.data.length,
        totalUsers: resUsers.data.length
      });
      
    } catch (e) {
      console.error("Failed to fetch admin data", e);
    } finally {
      setIsFetching(false);
    }
  };

  const startAddProduct = async () => {
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      // Backend createProduct endpoint creates a default draft product and returns it
      const { data } = await api.post('/api/products', {}, authOptions);
      
      setEditingProduct(data);
      setName('');
      setPrice('');
      setBrand('');
      setCategory(apiCategories[0]?.name || 'Living Room');
      setCountInStock(10);
      setColor('Gray');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80'); // High-quality pre-filled fallback
      setIsModalOpen(true);
    } catch (e) {
      console.error(e);
      alert('Failed to initialize product creation: ' + (e.response?.data?.message || e.message));
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setColor(product.color || '');
    setDescription(product.description);
    setImage(product.images?.[0] || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80');
    setIsModalOpen(true);
  };

  const saveProductHandler = async (e) => {
    e.preventDefault();
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      const updatedFields = {
        name,
        price: Number(price),
        brand,
        category,
        countInStock: Number(countInStock),
        color,
        description,
        images: [image]
      };
      await api.put(`/api/products/${editingProduct._id}`, updatedFields, authOptions);
      
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchAdminData();
      alert('Product saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (idx) => {
    setNotifications((prev) => prev.filter((_, i) => i !== idx));
  };

  const markOrderDelivered = async (orderId, idx) => {
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      await api.put(`/api/orders/${orderId}/deliver`, {}, authOptions);
      setNotifications((prev) =>
        prev.map((n, i) =>
          i === idx ? { ...n, processed: true, read: true } : n
        )
      );
      fetchAdminData();
    } catch (err) {
      alert('Failed to mark as delivered: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleOrderDelivered = async (orderId) => {
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      await api.put(`/api/orders/${orderId}/deliver`, {}, authOptions);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update delivery status: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleOrderPaid = async (orderId) => {
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
      await api.put(`/api/orders/${orderId}/pay-admin`, {}, authOptions);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update payment status: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
        await api.delete(`/api/products/${id}`, authOptions);
        fetchAdminData();
        alert('Product deleted successfully');
      } catch (error) {
        console.error(error);
        alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading || !user || !user.isAdmin) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Checking Authorization...</div>;

  return (
    <div className="flex min-h-[90vh] bg-slate-50 relative">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-[90vh] flex flex-col hidden md:flex border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black text-white tracking-tight">BIGDON<span className="text-blue-500">ADMIN</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <BarChart3 className="mr-3" size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <PackageSearch className="mr-3" size={20} /> Products
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'customers' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Users className="mr-3" size={20} /> Customers
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <ListOrdered className="mr-3" size={20} /> Orders
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <div className="p-4 sm:p-8">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{activeTab === 'customers' ? 'Users' : activeTab}</h1>
            <div className="flex items-center gap-4">
              {/* 🔔 Notification Bell */}
              <div className="relative" ref={notifPanelRef}>
                <button
                  onClick={() => { setIsNotifPanelOpen((v) => !v); markAllRead(); }}
                  className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                  title="Order Notifications"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {isNotifPanelOpen && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-900 text-base">🔔 Order Notifications</h3>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-xs text-red-500 hover:underline font-medium">Clear all</button>
                      )}
                    </div>
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <ShoppingBag size={36} className="mb-3 text-gray-300" />
                          <p className="text-sm font-medium">No new orders yet</p>
                          <p className="text-xs mt-1">New orders will appear here in real-time</p>
                        </div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div key={idx} className={`p-4 transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>}
                                  <span className="font-bold text-gray-900 text-sm truncate">New order from {notif.userName}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{notif.userEmail}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                                  <span className="font-bold text-green-600">${Number(notif.totalPrice || 0).toFixed(2)}</span>
                                  <span>·</span>
                                  <span>{notif.itemCount} item{notif.itemCount !== 1 ? 's' : ''}</span>
                                  <span>·</span>
                                  <span>{new Date(notif.receivedAt).toLocaleTimeString()}</span>
                                </div>
                                {notif.shippingAddress && (
                                  <p className="text-xs text-gray-400 truncate">
                                    📍 {notif.shippingAddress.address}, {notif.shippingAddress.city}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-3">
                                  {!notif.processed ? (
                                    <button
                                      onClick={() => markOrderDelivered(notif._id, idx)}
                                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                    >
                                      <CheckCircle size={12} /> Process Order
                                    </button>
                                  ) : (
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                      <CheckCircle size={12} /> Processed
                                    </span>
                                  )}
                                  <button
                                    onClick={() => { setActiveTab('orders'); setIsNotifPanelOpen(false); }}
                                    className="text-xs text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    View Orders
                                  </button>
                                </div>
                              </div>
                              <button onClick={() => dismissNotification(idx)} className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => { setActiveTab('orders'); setIsNotifPanelOpen(false); }}
                          className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View all orders →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {activeTab === 'products' && (
                <button onClick={startAddProduct} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center">
                  <Plus size={20} className="mr-2" /> Add Product
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden overflow-x-auto pb-4 mb-6 gap-2 scrollbar-none">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`flex items-center px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className={`flex items-center px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('customers')} 
              className={`flex items-center px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${activeTab === 'customers' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Customers
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`flex items-center px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Orders
            </button>
          </div>

          {isFetching ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-4"><BarChart3 size={32} /></div>
                      <h3 className="text-gray-500 font-medium mb-1">Total Sales</h3>
                      <p className="text-3xl font-black text-gray-900">${stats.totalSales.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-600 mb-4"><ListOrdered size={32} /></div>
                      <h3 className="text-gray-500 font-medium mb-1">Total Orders</h3>
                      <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 mb-4"><Users size={32} /></div>
                      <h3 className="text-gray-500 font-medium mb-1">Total Customers</h3>
                      <p className="text-3xl font-black text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-blue-600 font-medium hover:underline text-sm">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                            <th className="px-6 py-4 font-semibold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 text-gray-900 transition-colors">
                              <td className="px-6 py-4 font-bold text-blue-600">#{order._id.substring(0, 8)}</td>
                              <td className="px-6 py-4">{order.user?.name || 'Guest'}</td>
                              <td className="px-6 py-4 text-gray-500">{order.createdAt.substring(0, 10)}</td>
                              <td className="px-6 py-4 font-bold">${order.totalPrice.toFixed(2)}</td>
                              <td className="px-6 py-4 text-center">
                                {order.isDelivered ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium text-xs">Delivered</span>
                                ) : (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-medium text-xs">Processing</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'products' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                          <th className="px-6 py-4 font-semibold">ID</th>
                          <th className="px-6 py-4 font-semibold">Name</th>
                          <th className="px-6 py-4 font-semibold">Price</th>
                          <th className="px-6 py-4 font-semibold">Category</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{product._id.substring(0,8)}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-500">{product.category}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => startEditProduct(product)} className="text-blue-600 hover:text-blue-900 p-2"><Edit size={16}/></button>
                              <button onClick={() => deleteProductHandler(product._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                          <th className="px-6 py-4 font-semibold">ID</th>
                          <th className="px-6 py-4 font-semibold">Name</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {usersList.map((usr) => (
                          <tr key={usr._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{usr._id.substring(0,8)}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{usr.name}</td>
                            <td className="px-6 py-4 text-gray-500"><a href={`mailto:${usr.email}`} className="hover:underline">{usr.email}</a></td>
                            <td className="px-6 py-4">
                              {usr.isAdmin ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold">Admin</span> : <span className="text-gray-500 text-xs">Customer</span>}
                            </td>
                            <td className="px-6 py-4 text-right">
                               {!usr.isAdmin && <button className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16}/></button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                          <th className="px-6 py-4 font-semibold">ID</th>
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Total</th>
                          <th className="px-6 py-4 font-semibold">Paid</th>
                          <th className="px-6 py-4 font-semibold">Delivered</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 text-gray-500">{order._id.substring(0,8)}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{order.user?.name || 'Guest'}</td>
                            <td className="px-6 py-4 text-gray-500">{order.createdAt.substring(0, 10)}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              {order.isPaid ? <span className="text-green-600 font-bold">Paid</span> : <span className="text-red-500 font-bold">No</span>}
                            </td>
                            <td className="px-6 py-4">
                              {order.isDelivered ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-yellow-600 font-bold">Pending</span>}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => toggleOrderPaid(order._id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  order.isPaid
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                }`}
                              >
                                {order.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                              </button>
                              <button
                                onClick={() => toggleOrderDelivered(order._id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  order.isDelivered
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200'
                                }`}
                              >
                                {order.isDelivered ? 'Mark Pending' : 'Mark Delivered'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 font-outfit mb-6">
                {editingProduct?.name === 'Sample name' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <form onSubmit={saveProductHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Modern Sofa" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (USD)</label>
                    <input type="number" step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 299.99" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="e.g. BIGDON Design" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" value={category} onChange={(e) => setCategory(e.target.value)} required>
                      {apiCategories.filter(c => !c.parent).map((parent) => {
                        const subs = apiCategories.filter(c => c.parent === parent.name);
                        if (subs.length > 0) {
                          return (
                            <optgroup key={parent._id} label={parent.name}>
                              <option value={parent.name}>{parent.name} (All)</option>
                              {subs.map(sub => (
                                <option key={sub._id} value={sub.name}>{sub.name}</option>
                              ))}
                            </optgroup>
                          );
                        }
                        return (
                          <option key={parent._id} value={parent.name}>{parent.name}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Count</label>
                    <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Gray" />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      required 
                      placeholder="URL to product photo or uploaded file path" 
                    />
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-4 py-2.5 rounded-xl transition-all text-sm border border-blue-200 inline-block">
                        Choose File from Laptop
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={uploadFileHandler} 
                        />
                      </label>
                      {uploading && <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>}
                      {image && (
                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img 
                            src={image.startsWith('/') ? `${getBackendUrl()}${image}` : image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/100?text=Error'; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe this product..."></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={async () => {
                    setIsModalOpen(false);
                    // If it was a newly created sample, clean it up from MongoDB if cancelled
                    if (editingProduct?.name === 'Sample name') {
                      try {
                        const authOptions = { headers: { Authorization: `Bearer ${user?.token}` } };
                        await api.delete(`/api/products/${editingProduct._id}`, authOptions);
                      } catch(err) {
                        console.error(err);
                      }
                    }
                    setEditingProduct(null);
                    fetchAdminData();
                  }} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
