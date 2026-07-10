"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import api from '../utils/axiosInstance';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryNavbar() {
  const [categories, setCategories] = useState([]);
  const [activeParent, setActiveParent] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveParent(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleParentClick = (e, parentName) => {
    e.stopPropagation();
    setActiveParent(activeParent === parentName ? null : parentName);
  };

  const getCategoryLabel = (name) => {
    // Normalizes "Bathroom Accessories" to "bathroomAccessories", "Bar/Lounge Chairs" to "barLoungeChairs"
    const camelKey = name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    return t(camelKey) || name;
  };

  const parents = categories.filter(c => !c.parent);

  const getSubcategories = (parentName) => {
    return categories.filter(c => c.parent === parentName);
  };

  if (parents.length === 0) return null;

  return (
    <div className="hidden md:block bg-white border-b border-gray-100 shadow-xs sticky top-16 z-40 transition-all font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 h-11 items-center overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
          {parents.map((parent) => {
            const subs = getSubcategories(parent.name);
            const hasSubs = subs.length > 0;

            if (hasSubs) {
              const isOpen = activeParent === parent.name;
              return (
                <div key={parent._id} className="relative group flex items-center h-full">
                  <button 
                    onClick={(e) => handleParentClick(e, parent.name)}
                    className="flex items-center text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider py-1.5 focus:outline-none cursor-pointer"
                  >
                    {getCategoryLabel(parent.name)}
                    <ChevronDown size={14} className="ml-1 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className={`absolute left-0 top-full pt-1 transition-all duration-200 z-50 ${
                    isOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}>
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 w-56 overflow-hidden">
                      <div className="max-h-72 overflow-y-auto scrollbar-thin">
                        {/* Parent Category option ("View All") */}
                        <Link
                          href={`/shop?category=${encodeURIComponent(parent.name)}`}
                          onClick={() => setActiveParent(null)}
                          className="block px-4 py-2 text-[11px] font-bold uppercase text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-50"
                        >
                          {t('viewAll') || 'View All'} {getCategoryLabel(parent.name)}
                        </Link>
                        {subs.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/shop?category=${encodeURIComponent(sub.name)}`}
                            onClick={() => setActiveParent(null)}
                            className="block px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {getCategoryLabel(sub.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={parent._id}
                href={`/shop?category=${encodeURIComponent(parent.name)}`}
                className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider py-1.5 whitespace-nowrap"
              >
                {getCategoryLabel(parent.name)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
