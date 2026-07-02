"use client";

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Package, MapPin, Heart, LogOut } from 'lucide-react';
import Link from 'next/link';
import api from '../../utils/axiosInstance';

export default function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  // Profile Edit State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      const fetchOrders = async () => {
        try {
          const { data } = await api.get('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders");
        }
      };
      fetchOrders();
    }
  }, [user, loading, router]);

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/api/users/profile', { name, email, password, address: { street: address } }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Context should ideally hold the update, we just re-sync loosely here
      if (typeof window !== 'undefined') {
         localStorage.setItem('userInfo', JSON.stringify(data));
      }
      setUpdateMsg('Profile updated successfully!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      setUpdateMsg('Error updating profile');
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] content-start">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">My Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, <span className="font-bold text-gray-900">{user.name}</span>!</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          {user.isAdmin && (
            <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
              Admin Panel
            </Link>
          )}
          <button onClick={logout} className="flex flex-center items-center bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <nav className="flex flex-col">
              <button onClick={() => setActiveTab('orders')} className={`flex items-center px-6 py-4 text-left transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
                <Package size={20} className="mr-3" /> Orders
              </button>
              <button onClick={() => setActiveTab('profile')} className={`flex items-center px-6 py-4 text-left transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
                <UserIcon size={20} className="mr-3" /> Edit Profile
              </button>
              <Link href="/wishlist" className="flex items-center px-6 py-4 text-left transition-colors text-gray-600 hover:bg-gray-50 border-l-4 border-transparent">
                <Heart size={20} className="mr-3" /> Wishlist
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-6 text-center py-16">
                  <Package className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
                  <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition">Start Shopping</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                        <th className="px-6 py-4 font-semibold">ID</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Paid</th>
                        <th className="px-6 py-4 font-semibold">Delivered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors text-gray-900">
                          <td className="px-6 py-4 font-medium text-gray-900">{order._id.substring(0, 10)}...</td>
                          <td className="px-6 py-4 text-gray-500">{order.createdAt.substring(0, 10)}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {order.isPaid ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">Yes</span>
                            ) : (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium text-xs">No</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {order.isDelivered ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">Yes</span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium text-xs">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              </div>
              
              <div className="p-8">
                {updateMsg && <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${updateMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{updateMsg}</div>}
                
                <form onSubmit={submitProfileUpdate} className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                    <input type="text" placeholder="123 Main St" className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  
                  <button type="submit" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-colors w-full shadow-sm mt-4">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
