"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/axiosInstance";
import "./SearchModal.css";

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
    return img.startsWith('/') ? `http://localhost:5001${img}` : img;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="search-modal"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-header">
              <SearchIcon className="search-icon-input" size={24} />
              <input
                id="search-input"
                type="text"
                placeholder="Search products, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <button className="icon-btn close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="search-results">
              {isSearching && (
                <div className="no-results">
                  <p>Searching...</p>
                </div>
              )}

              {!isSearching && query.trim() !== "" && results.length === 0 && (
                <div className="no-results">
                  <p>No products found for "{query}"</p>
                </div>
              )}

              {results.map((product) => {
                const imgSrc = getProductImg(product);
                return (
                  <motion.a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="search-result-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onClose}
                    style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
                  >
                    <div className="result-img-container">
                      {imgSrc ? (
                        <img src={imgSrc} alt={product.name} />
                      ) : (
                        <div className="result-img-placeholder">{product.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="result-info">
                      <h4>{product.name}</h4>
                      <span>{product.category}</span>
                    </div>
                    <div className="result-action">
                      <span className="result-price">${product.price?.toFixed(2)}</span>
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
