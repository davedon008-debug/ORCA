"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Globe } from 'lucide-react';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { user, logout, setAuthModalOpen } = useContext(AuthContext);
  const { lang, changeLanguage, t, currentLang, LANGUAGES } = useLanguage();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/shop?keyword=${keyword}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <nav className="glass shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center mr-4">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <img src="/bigdon_logo.png" alt="BIGDON Logo" className="h-10 w-auto object-contain mr-3 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
              <span className="font-outfit font-black text-2xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">BIGDON</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={submitHandler} className="w-full max-w-lg relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:bg-white"
              />
              <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-500">
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-6">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
              title="Search"
            >
              <Search size={24} />
            </button>

            {/* Language Selector Dropdown */}
            <div 
              onClick={() => setIsLangOpen(!isLangOpen)}
              onMouseLeave={() => setIsLangOpen(false)}
              className="relative group cursor-pointer flex items-center space-x-2"
            >
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors select-none">
                <Globe size={20} className="mr-1" />
                <span className="hidden md:inline text-sm font-medium">{currentLang.flag} {currentLang.label}</span>
              </div>
              <div className={`absolute right-0 top-full pt-1 w-40 transition-opacity duration-150 z-50 ${
                isLangOpen 
                  ? 'opacity-100 visible' 
                  : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'
              }`}>
                <div className="bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl shadow-xl overflow-hidden">
                  <div className="py-1">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          changeLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors ${
                          lang === l.code
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2 text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              /* Logged-in: show name + instant dropdown */
              <div 
                onClick={() => setIsUserOpen(!isUserOpen)}
                onMouseLeave={() => setIsUserOpen(false)}
                className="relative group cursor-pointer flex items-center space-x-2"
              >
                <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors select-none">
                  <User size={24} />
                  <span className="hidden md:block ml-1 font-medium">{user.name}</span>
                </div>
                <div className={`absolute right-0 top-full pt-1 w-52 transition-opacity duration-150 z-50 ${
                  isUserOpen
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'
                }`}>
                  <div className="bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl shadow-xl overflow-hidden">
                    <div className="py-1">
                      <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        {t("dashboard")}
                      </Link>
                      {user.isAdmin && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          {t("adminPanel")}
                        </Link>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          logout();
                          setIsUserOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t("logout")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)} 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium focus:outline-none"
              >
                <User size={24} className="mr-1" />
                <span className="hidden md:block">{t("signIn")}</span>
              </button>
            )}
            
          </div>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
