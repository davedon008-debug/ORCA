"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getBackendUrl } from '../../utils/axiosInstance';

export default function Cart() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { t } = useLanguage();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart')}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">{t('emptyCart')}</h2>
          <Link href="/shop" className="text-blue-600 font-bold hover:text-blue-800 underline">
            {t('continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                    <img 
                      src={
                        (() => {
                          const img = item.images && item.images[0] !== '/images/sample.jpg' 
                            ? item.images[0] 
                            : 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150&q=80';
                          return img.startsWith('/') ? `${getBackendUrl()}${img}` : img;
                        })()
                      } 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-lg" 
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <Link href={`/product/${item.product}`} className="font-bold text-lg text-gray-900 hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <select
                        value={item.qty}
                        onChange={(e) => addToCart(item, Number(e.target.value))}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 py-2 px-3 outline-none"
                      >
                        {[...Array(item.countInStock || 10).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title={t('removeItem')}
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h2>
              
              <div className="flex justify-between mb-4 text-gray-600">
                <span>{t('products')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4 text-gray-600">
                <span>{t('shipping')}</span>
                <span className="font-medium">{subtotal > 500 ? t('freeShipping') : '$20.00'}</span>
              </div>
              
              <hr className="my-4 border-gray-200" />
              
              <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                <span>{t('total')}</span>
                <span className="text-blue-600">${(subtotal + (subtotal > 500 ? 0 : 20)).toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-blue-500/50 flex justify-center items-center transition-all transform hover:-translate-y-1">
                {t('proceedToCheckout')} <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
