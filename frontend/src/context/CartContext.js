"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

// Returns a unique localStorage key per user (or guest if not logged in)
function getCartKey(userId) {
  return userId ? `cartItems_${userId}` : "cartItems_guest";
}

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Reload cart whenever the logged-in user changes (login / logout / switch account)
  useEffect(() => {
    const key = getCartKey(user?._id);
    const saved = localStorage.getItem(key);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [user?._id]);

  const saveToStorage = (items) => {
    const key = getCartKey(user?._id);
    localStorage.setItem(key, JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const finalQty = product.qty || qty;
    const productId = product.product || product._id;

    const exist = cartItems.find((x) => x.product === productId);
    let updated;

    if (exist) {
      updated = cartItems.map((x) =>
        x.product === productId ? { ...x, qty: finalQty } : x
      );
    } else {
      updated = [
        ...cartItems,
        {
          product: productId,
          name: product.name,
          price: product.price,
          images: product.images,
          countInStock: product.countInStock,
          qty: finalQty,
        },
      ];
    }

    setCartItems(updated);
    saveToStorage(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((x) => x.product !== id);
    setCartItems(updated);
    saveToStorage(updated);
  };

  const clearCart = () => {
    const key = getCartKey(user?._id);
    setCartItems([]);
    localStorage.removeItem(key);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};