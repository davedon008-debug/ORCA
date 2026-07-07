"use client";

import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Clock, Star, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api, { getBackendUrl } from '../utils/axiosInstance';
import { CartContext } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  const heroSlides = [
    {
      image: '/discount_banner.jpg',
      title: t('Up To 50% Off\nSpecial Offer. ') || 'Up To 50% Off\nSpecial Offer.',
      desc: t('Take advantage of our exclusive discount on high-quality home furniture and appliances.') || 'Take advantage of our exclusive discount on high-quality home furniture and appliances.',
    },
    {
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80',
      title: t('slideTitle1'),
      desc: t('slideDesc1'),
    },
    {
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=80',
      title: t('slideTitle2'),
      desc: t('slideDesc2'),
    },
    {
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1920&q=80',
      title: t('slideTitle3'),
      desc: t('slideDesc3'),
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data } = await api.get('/api/products?pageSize=4');
        setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch products for home page", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section with Slider */}
      <section className="relative h-[85vh] flex items-center bg-gray-900 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div 
            key={index}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/30 z-10" />
            <img 
              src={slide.image}
              alt="Slide Background" 
              className="w-full h-full object-cover scale-105 transform origin-center"
            />
          </motion.div>
        ))}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-inter">
          <div className="max-w-2xl text-white">
            <motion.h1 
              key={`title-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-outfit text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1]"
              style={{ whiteSpace: 'pre-line' }}
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p 
              key={`desc-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-10 text-gray-300 font-light"
            >
              {heroSlides[currentSlide].desc}
            </motion.p>
            <motion.div 
              key={`btn-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link href="/shop" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center justify-center custom-shadow">
                {t('shopCollectionBtn')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center space-x-3">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex items-center justify-center flex-col text-center p-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-slate-50 p-4 rounded-full mb-4 text-blue-600 shadow-sm border border-gray-100">
                <Truck size={28} />
              </div>
              <h3 className="font-bold text-gray-900">{t('freeDelivery')}</h3>
              <p className="text-gray-500 text-sm hidden md:block mt-1">{t('freeDeliverySub')}</p>
            </div>
            <div className="flex items-center justify-center flex-col text-center p-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-slate-50 p-4 rounded-full mb-4 text-blue-600 shadow-sm border border-gray-100">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-gray-900">{t('yearWarranty')}</h3>
              <p className="text-gray-500 text-sm hidden md:block mt-1">{t('warrantySub')}</p>
            </div>
            <div className="flex items-center justify-center flex-col text-center p-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-slate-50 p-4 rounded-full mb-4 text-blue-600 shadow-sm border border-gray-100">
                <CreditCard size={28} />
              </div>
              <h3 className="font-bold text-gray-900">{t('securePaymentsBadge')}</h3>
              <p className="text-gray-500 text-sm hidden md:block mt-1">{t('securePaymentsBadgeSub')}</p>
            </div>
            <div className="flex items-center justify-center flex-col text-center p-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-slate-50 p-4 rounded-full mb-4 text-blue-600 shadow-sm border border-gray-100">
                <Clock size={28} />
              </div>
              <h3 className="font-bold text-gray-900">{t('supportBadge')}</h3>
              <p className="text-gray-500 text-sm hidden md:block mt-1">{t('supportBadgeSub')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-outfit text-4xl font-extrabold text-gray-900 tracking-tight">{t('shopByCategory')}</h2>
              <p className="text-gray-500 mt-2 text-lg">{t('categorySub')}</p>
            </div>
            <Link href="/shop" className="text-blue-600 font-medium hover:text-blue-700 flex items-center hidden md:flex">
              {t('viewAll')} <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/shop?category=Living Room" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80" alt="Living Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-1">{t('livingRoom')}</h3>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{t('shopNow')} &rarr;</span>
              </div>
            </Link>
            
            <Link href="/shop?category=Kitchen" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80" alt="Kitchen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-1">{t('kitchen')}</h3>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{t('shopNow')} &rarr;</span>
              </div>
            </Link>

            <Link href="/shop?category=Bedroom" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80" alt="Bedroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-1">{t('bedroom')}</h3>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{t('shopNow')} &rarr;</span>
              </div>
            </Link>

            <Link href="/shop?category=Office" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80" alt="Home Office" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-1">{t('office')}</h3>
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{t('shopNow')} &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-4xl font-extrabold text-gray-900 tracking-tight">{t('newArrivals')}</h2>
            <p className="text-gray-500 mt-2 text-lg">{t('featuredProducts')}</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-medium">{t('noProductsFound')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => {
                const fallbackImg = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80";
                let productImg = product.images?.[0] && product.images[0] !== '/images/sample.jpg' ? product.images[0] : fallbackImg;
                if (productImg.startsWith('/')) {
                  productImg = `${getBackendUrl()}${productImg}`;
                }
                return (
                  <div key={product._id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => router.push(`/product/${product._id}`)}>
                      <div className="absolute top-3 left-3 z-10 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded">{t('newArrivals').toUpperCase().split(' ')[0]}</div>
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm ${
                          isInWishlist(product._id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart size={18} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                      </button>
                      <img src={productImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.round(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"} />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors" onClick={() => router.push(`/product/${product._id}`)}>{product.name}</h3>
                      <p className="text-blue-600 font-bold mb-4">${product.price?.toFixed(2)}</p>
                      <div className="mt-auto flex gap-2">
                        <Link href={`/product/${product._id}`} className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-medium transition-colors text-sm">
                          {t('viewAll').split(' ')[0]}
                        </Link>
                        <button 
                          onClick={() => addToCart({ ...product, qty: 1 })}
                          className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 rounded-xl transition-colors font-bold"
                          title={t('addToCart')}
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-blue-600 flex flex-col md:flex-row items-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center" />
            <div className="relative z-10 p-10 md:p-16 flex-1 text-center md:text-left">
              <h3 className="text-blue-200 font-bold tracking-wider uppercase text-sm mb-2">Flash Sale</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Up to 40% Off Premium Furniture</h2>
              <p className="text-blue-100 mb-8 max-w-lg">Transform your home with our exclusive summer collection. Limited time offer.</p>
              <Link href="/shop" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
                {t('shopNow')}
              </Link>
            </div>
            <div className="relative z-10 hidden md:block flex-1 h-full min-h-[400px]">
               <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80" alt="Promo" className="absolute left-0 right-0 bottom-0 w-full h-[120%] object-cover rounded-tl-[100px] shadow-2xl border-l-[10px] border-t-[10px] border-white/10" />
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
