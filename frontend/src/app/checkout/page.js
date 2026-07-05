"use client";

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Optimus Bank Transfer');

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxPrice = Number((0.15 * subtotal).toFixed(2));
  const shippingPrice = subtotal > 500 ? 0 : 20;
  const totalPrice = Number((subtotal + taxPrice + shippingPrice).toFixed(2));

  const exchangeRate = 1500; // 1 USD = 1500 NGN
  const totalInNaira = (Number(totalPrice) * exchangeRate).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to place an order.');
      router.push('/');
      return;
    }

    // Frontend validation
    if (!address.trim() || !city.trim() || !country.trim()) {
      alert('Please fill in your full shipping address (Street, City, and Country are required).');
      return;
    }

    if (cartItems.length === 0) {
      alert(t('emptyCart'));
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(i => ({
          name: i.name,
          qty: i.qty,
          image: i.images?.[0] || i.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=80',
          price: i.price,
          product: i.product || i._id
        })),
        shippingAddress: { street: address.trim(), city: city.trim(), postalCode: postalCode.trim(), country: country.trim() },
        paymentMethod,
        itemsPrice: Number(subtotal.toFixed(2)),
        taxPrice: Number(taxPrice),
        shippingPrice: Number(shippingPrice),
        totalPrice: Number(totalPrice)
      };

      console.log('Submitting order:', JSON.stringify(orderData, null, 2));

      const { data } = await api.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(`Order Placed Successfully!\n\nPlease transfer ${totalInNaira} (equivalent to $${totalPrice.toFixed(2)}) to:\n\nBank: Optimus Bank\nAccount Number: 2002245072\nAccount Name: Donald Ekemini David\n\nYour order status will be updated once the transfer is verified.`);
      clearCart();
      router.push('/dashboard');
    } catch (error) {
      console.error('Order error full details:', error.response?.data);
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <ShoppingBag className="mr-3 text-blue-600" size={32} /> {t('secureCheckout')}
      </h1>

      <form onSubmit={placeOrderHandler}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="mr-2 text-blue-600" /> {t('shippingInfo')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-3 px-4 border outline-none text-gray-900" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                  <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-3 px-4 border outline-none text-gray-900" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode')}</label>
                  <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-3 px-4 border outline-none text-gray-900" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}</label>
                <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-3 px-4 border outline-none text-gray-900" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="mr-2 text-blue-600" /> {t('paymentMethod')}
            </h2>
            <div className="space-y-4">
              <label className="flex flex-col p-4 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center mb-2">
                  <input type="radio" name="payment" value="Optimus Bank Transfer" checked={true} readOnly className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-3 font-bold text-blue-900">Direct Bank Transfer (Optimus Bank)</span>
                </div>
                <div className="ml-7 text-sm text-blue-800 space-y-1">
                  <p className="font-semibold">Bank: <span className="text-blue-900">Optimus Bank</span></p>
                  <p className="font-semibold">Account Number: <span className="text-blue-900 select-all font-mono">2002245072</span></p>
                  <p className="font-semibold">Account Name: <span className="text-blue-900">Donald Ekemini David</span></p>
                  <p className="mt-2 text-xs text-blue-600">Your order will not ship until the funds have cleared in our account.</p>
                </div>
              </label>
            </div>
          </div>

        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h2>
            
            <div className="flex justify-between mb-3 text-gray-600">
              <span>{t('subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-600">
              <span>{t('shipping')}</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>{t('tax')}</span>
              <span>${taxPrice}</span>
            </div>
            
            <hr className="my-4 border-gray-200" />
            
            <div className="flex justify-between mb-2 text-2xl font-bold text-gray-900">
              <span>{t('total')} (USD)</span>
              <span className="text-blue-600">${totalPrice}</span>
            </div>
            
            <div className="flex justify-between mb-6 text-lg font-bold text-emerald-600">
              <span>Total (NGN)</span>
              <span>{totalInNaira}</span>
            </div>

            <button 
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('placeOrder')}
            </button>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
}
