"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";
import api from "../utils/axiosInstance";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products?pageSize=4&sort=newest");
        setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch featured products", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-section">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <motion.h2
            className="title"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            New <span style={{ color: "var(--accent)" }}>Arrivals</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/shop" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              View All
            </Link>
          </motion.div>
        </div>

        <div className="products-grid">
          {products.map((product, index) => {
            const img = product.images?.[0] && product.images[0] !== '/images/sample.jpg'
              ? (product.images[0].startsWith('/') ? `http://localhost:5001${product.images[0]}` : product.images[0])
              : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80";

            return (
              <motion.div
                key={product._id}
                className="product-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="product-image-container"
                  onClick={() => router.push(`/product/${product._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                  <button
                    className="add-to-cart-quick"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ ...product, qty: 1 });
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <h3
                      className="product-name"
                      onClick={() => router.push(`/product/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>
                    <span className="product-category">{product.category}</span>
                    <div className="flex items-center mt-1 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.round(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="product-price">${product.price?.toFixed(2)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
