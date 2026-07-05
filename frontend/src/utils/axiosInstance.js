import axios from "axios";

export const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (typeof window !== "undefined") {
    // Fall back to localhost dev server if no backend URL environment variable is set
    return `http://localhost:5001`;
  }
  return "http://localhost:5001";
};

const api = axios.create({
  baseURL: getBackendUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    if (user) {
      const token = JSON.parse(user)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

export default api;
