"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/axiosInstance";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/users/login", {
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post("/api/users/google", {
      idToken,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/users", {
      name,
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, isAuthModalOpen, setAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);