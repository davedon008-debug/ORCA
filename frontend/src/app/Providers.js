"use client";

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import { WishlistProvider } from '../context/WishlistContext';

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
