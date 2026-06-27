"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Star, ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import api from "../../utils/axiosInstance";
import "./products.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products?pageSize=50");
        setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch products", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="products-page">
        <div className="container">
          <div className="page-header">
            <motion.h1
              className="page-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              All <span style={{ color: "var(--accent)" }}>Products</span>
            </motion.h1>
            <motion.p
              className="page-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Shop our entire collection of premium home appliances and furniture.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl font-medium mb-4">No products found.</p>
              <Link href="/shop" className="text-blue-600 hover:underline font-bold">
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="all-products-grid">
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
                    transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
