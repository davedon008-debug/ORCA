"use client";

import { useEffect, useState, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Filter, ShoppingBag, Heart } from 'lucide-react';
import api, { getBackendUrl } from '../../utils/axiosInstance';
import { CartContext } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWishlist } from '../../context/WishlistContext';

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Filters
  const keyword = searchParams.get('keyword') || '';
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('newest');
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `/api/products?keyword=${keyword}&sort=${sort}`;
        if (category !== 'all') query += `&category=${category}`;
        
        const { data } = await api.get(query);
        setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch products", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, sort]);

  const categories = ['all', 'Living Room', 'Kitchen', 'Bedroom', 'Office'];

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'all': return t('allProducts');
      case 'Living Room': return t('livingRoom');
      case 'Kitchen': return t('kitchen');
      case 'Bedroom': return t('bedroom');
      case 'Office': return t('office');
      default: return cat;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-outfit font-black mb-4">
            {keyword ? `${t('searchResultsFor')} "${keyword}"` : category !== 'all' ? getCategoryLabel(category) : t('shopCollection')}
          </h1>
          <p className="text-gray-400 text-lg">{t('shopSub')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center"><Filter size={18} className="mr-2"/> {t('filters')}</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('categories')}</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setCategory(cat)}
                      className={`text-sm w-full text-left capitalize transition-colors ${category === cat ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('sortBy')}</h4>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="lowest">{t('sortLowest')}</option>
                <option value="highest">{t('sortHighest')}</option>
                <option value="popular">{t('sortPopular')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('noProductsFound')}</h2>
              <p className="text-gray-500">{t('noProductsFoundSub')}</p>
              <button 
                onClick={() => { setCategory('all'); router.push('/shop'); }}
                className="mt-6 text-blue-600 font-medium hover:underline"
              >
                {t('clearAllFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                  
                  <div className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => router.push(`/product/${product._id}`)}>
                    <img
                      src={
                        (() => {
                          const img = product.images?.[0] && product.images[0] !== '/images/sample.jpg' 
                            ? product.images[0] 
                            : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80";
                          return img.startsWith('/') ? `${getBackendUrl()}${img}` : img;
                        })()
                      }
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full transition-all z-10 shadow-sm opacity-0 group-hover:opacity-100 ${
                        isInWishlist(product._id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart size={18} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                    </button>
                    {product.isNewArrival && (
                      <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">{t('newArrivals').toUpperCase().split(' ')[0]}</div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/product/${product._id}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">{product.brand}</p>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.round(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"} />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">({product.numReviews})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-black text-xl text-gray-900">${product.price?.toFixed(2) || "0.00"}</span>
                      <button 
                        onClick={() => addToCart({ ...product, qty: 1 })}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-full transition-colors font-bold flex items-center justify-center h-10 w-10"
                        title={t('addToCart')}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
