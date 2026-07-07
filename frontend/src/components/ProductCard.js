"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "./CartProvider";
import { getBackendUrl } from "../utils/axiosInstance";
import "./ProductCard.css";

export default function ProductCard({ product, index }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="product-image-container">
        {(product.image || (product.images && product.images[0])) ? (
          <img 
            src={(product.image || product.images[0]).startsWith('/') ? `${getBackendUrl()}${product.image || product.images[0]}` : (product.image || product.images[0])} 
            alt={product.name} 
            className="product-image" 
            loading="lazy" 
          />
        ) : (
          <div className="product-placeholder">
            {product.name.charAt(0)}
          </div>
        )}
        <button 
          className="add-to-cart-quick"
          onClick={() => addToCart(product)}
          aria-label="Add to cart"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="product-info">
        <div>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-category">{product.category}</span>
        </div>
        <div className="product-price">{product.price}</div>
      </div>
    </motion.div>
  );
}
