"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

// Returns a unique localStorage key per user (or guest if not logged in)
function getWishlistKey(userId) {
  return userId ? `wishlistItems_${userId}` : "wishlistItems_guest";
}

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Reload wishlist whenever the logged-in user changes (login / logout / switch account)
  useEffect(() => {
    const key = getWishlistKey(user?._id);
    const saved = localStorage.getItem(key);
    setWishlistItems(saved ? JSON.parse(saved) : []);
  }, [user?._id]);

  const saveToStorage = (items) => {
    const key = getWishlistKey(user?._id);
    localStorage.setItem(key, JSON.stringify(items));
  };

  const toggleWishlist = (product) => {
    const productId = product._id || product.product;
    const exist = wishlistItems.find((x) => (x._id || x.product) === productId);
    let updated;

    if (exist) {
      updated = wishlistItems.filter((x) => (x._id || x.product) !== productId);
    } else {
      updated = [
        ...wishlistItems,
        {
          _id: productId,
          name: product.name,
          price: product.price,
          // Support both backend/frontend image structures
          image: product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80',
          countInStock: product.countInStock || 10,
        },
      ];
    }

    setWishlistItems(updated);
    saveToStorage(updated);
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter((x) => (x._id || x.product) !== productId);
    setWishlistItems(updated);
    saveToStorage(updated);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((x) => (x._id || x.product) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
