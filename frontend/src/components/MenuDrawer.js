"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import "./MenuDrawer.css";

const menuLinks = [
  { name: "Home", href: "/" },
  { name: "Shop All", href: "/products" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
];

export default function MenuDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="menu-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <div className="menu-header">
              <h2 className="menu-title">BIG DON</h2>
              <button 
                className="icon-btn close-btn" 
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="menu-nav">
              <ul>
                {menuLinks.map((link, i) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                  >
                    <Link href={link.href} className="menu-link" onClick={onClose}>
                      {link.name}
                      <ChevronRight size={20} className="menu-link-icon" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="menu-footer">
              <Link href="/login" className="btn-primary login-btn" onClick={onClose}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
