"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ShoppingBag, Heart, User, Sparkles, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import api from "../utils/axiosInstance";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";

export default function MenuDrawer({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { user, logout, setAuthModalOpen } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [expandedParents, setExpandedParents] = useState({});

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const { data } = await api.get("/api/categories");
          setCategories(data);
        } catch (err) {
          console.error("Failed to load categories in drawer", err);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const toggleParent = (parentName) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentName]: !prev[parentName],
    }));
  };

  const getCategoryLabel = (name) => {
    const camelKey = name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    return t(camelKey) || name;
  };

  const parents = categories.filter((c) => !c.parent);
  const getSubcategories = (parentName) => {
    return categories.filter((c) => c.parent === parentName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#FAF9F6] border-r border-gray-100 shadow-2xl z-50 flex flex-col font-inter"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
              <Link href="/" className="flex items-center" onClick={onClose}>
                <img src="/bigdon_logo.png" alt="BIGDON Logo" className="h-8 w-auto object-contain mr-2" />
                <span className="font-outfit font-black text-lg tracking-tight text-gray-900">BIGDON</span>
              </Link>
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
              {/* Primary Links */}
              <div className="space-y-1.5">
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold transition-all"
                >
                  <ShoppingBag size={18} className="text-gray-400" />
                  <span>{t("allProducts") || "Shop All"}</span>
                </Link>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold transition-all"
                >
                  <Sparkles size={18} className="text-gray-400" />
                  <span>{t("newArrivals") || "New Arrivals"}</span>
                </Link>
              </div>

              <hr className="border-gray-200/60" />

              {/* Categories Section */}
              <div>
                <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {t("categories") || "Categories"}
                </h3>
                <div className="space-y-1">
                  {parents.map((parent) => {
                    const subs = getSubcategories(parent.name);
                    const hasSubs = subs.length > 0;
                    const isExpanded = !!expandedParents[parent.name];

                    return (
                      <div key={parent._id} className="space-y-1">
                        {hasSubs ? (
                          <>
                            <button
                              onClick={() => toggleParent(parent.name)}
                              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold text-left transition-all cursor-pointer"
                            >
                              <span>{getCategoryLabel(parent.name)}</span>
                              <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-blue-600" : ""
                                }`}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden pl-4 pr-2 space-y-1 bg-gray-50/50 rounded-xl"
                                >
                                  <Link
                                    href={`/shop?category=${encodeURIComponent(parent.name)}`}
                                    onClick={onClose}
                                    className="block px-3 py-2 text-xs font-bold text-blue-500 uppercase hover:text-blue-600"
                                  >
                                    {t("viewAll") || "View All"} {getCategoryLabel(parent.name)}
                                  </Link>
                                  {subs.map((sub) => (
                                    <Link
                                      key={sub._id}
                                      href={`/shop?category=${encodeURIComponent(sub.name)}`}
                                      onClick={onClose}
                                      className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                      {getCategoryLabel(sub.name)}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={`/shop?category=${encodeURIComponent(parent.name)}`}
                            onClick={onClose}
                            className="block px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold transition-all"
                          >
                            {getCategoryLabel(parent.name)}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Extras */}
              <div className="space-y-1">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold transition-all"
                >
                  <Heart size={18} className="text-gray-400" />
                  <span>{t("myWishlist") || "Wishlist"}</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/70 hover:text-blue-600 font-semibold transition-all"
                >
                  <User size={18} className="text-gray-400" />
                  <span>{t("myAccount") || "My Account"}</span>
                </Link>
              </div>
            </div>

            {/* Footer / User Session */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-500 font-medium truncate">
                    {t("signedInAs") === "signedInAs" ? "Signed in as" : t("signedInAs")}: <span className="font-bold text-gray-900">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-2.5 rounded-xl font-semibold transition-colors text-sm cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>{t("logout") || "Sign Out"}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <LogIn size={16} />
                  <span>{t("signIn") || "Sign In"}</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
