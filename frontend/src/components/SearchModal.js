"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import api, { getBackendUrl } from "../utils/axiosInstance";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced live search from API
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await api.get(`/api/products?keyword=${encodeURIComponent(query.trim())}&pageSize=8`);
        setResults(data.products || []);
      } catch (e) {
        console.error("Search error", e);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const getProductImg = (product) => {
    const img = product.images?.[0] && product.images[0] !== '/images/sample.jpg'
      ? product.images[0]
      : product.image || null;
    if (!img) return null;
    return img.startsWith('/') ? `${getBackendUrl()}${img}` : img;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-start pt-[10vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 gap-4">
              <SearchIcon className="text-gray-400 dark:text-gray-500" size={24} />
              <input
                id="search-input"
                type="text"
                placeholder="Search products, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-gray-950 dark:text-white text-lg outline-none placeholder:text-gray-400"
              />
              <button 
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
                onClick={onClose}
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto py-4 divide-y divide-gray-50 dark:divide-slate-800/50">
              {isSearching && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                  <p>Searching...</p>
                </div>
              )}

              {!isSearching && query.trim() !== "" && results.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                  <p>No products found for "{query}"</p>
                </div>
              )}

              {results.map((product) => {
                const imgSrc = getProductImg(product);
                return (
                  <motion.a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="flex items-center px-6 py-4 gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors w-full text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onClose}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                      {imgSrc ? (
                        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full display-flex items-center justify-center font-bold text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-slate-700 text-xl">{product.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h4>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium capitalize">{product.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">${product.price?.toFixed(2)}</span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
