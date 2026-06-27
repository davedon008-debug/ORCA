import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token safely
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const token = JSON.parse(userInfo)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export default api;