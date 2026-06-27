"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { useToast } from "./ToastProvider";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast();

  const handleCheckout = () => {
    clearCart();
    setIsCartOpen(false);
    addToast("Checkout successful! Thank you for your purchase.", "success");
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return total + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="cart-header">
              <h2>Your Cart ({cartItems.length})</h2>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                       {item.name.charAt(0)}
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">{item.price}</p>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn-accent checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
