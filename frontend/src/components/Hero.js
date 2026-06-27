"use client";

import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  const scrollToProducts = () => {
    const featuredSection = document.querySelector(".featured-section");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="hero-title">Rule The<br/>Streets</h1>
        </motion.div>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Premium oversized apparel built for giants.
        </motion.p>
        
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button 
            className="btn-accent" 
            style={{ padding: "1.2rem 3rem", fontSize: "1.1rem" }}
            onClick={scrollToProducts}
          >
            Shop Latest
          </button>
        </motion.div>
      </div>

      <div className="hero-background">
        <div className="noise-overlay"></div>
      </div>
    </section>
  );
}
