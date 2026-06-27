"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Wishlist() {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { t } = useLanguage();

  const handleAddToCart = (item) => {
    const finalProductId = item._id || item.product;
    addToCart({ 
      product: finalProductId, 
      name: item.name, 
      price: item.price, 
      images: [item.image] 
    }, 1);
    removeFromWishlist(finalProductId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex items-center mb-8">
        <Heart className="text-red-500 mr-3 fill-current" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">{t('myWishlist')}</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-2xl font-medium text-gray-600 mb-4">{t('emptyWishlist')}</h2>
          <Link href="/shop" className="text-blue-600 font-bold hover:text-blue-800 underline">
            {t('discoverProducts')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => {
            const itemId = item._id || item.product;
            return (
              <div key={itemId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group shrink-0">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={item.image.startsWith('/') ? `http://localhost:5001${item.image}` : item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <button 
                    onClick={() => removeFromWishlist(itemId)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <Link href={`/product/${itemId}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600 truncate">{item.name}</h3>
                  </Link>
                  <p className="text-xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center"
                  >
                    <ShoppingCart size={18} className="mr-2" /> {t('moveToCart')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
