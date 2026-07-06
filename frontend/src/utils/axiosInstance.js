import axios from "axios";

export const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // If accessing via local IP or localhost, connect to the same host's port 5001
    if (host === "localhost" || host === "127.0.0.1" || host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return `http://${host}:5001`;
    }
    return `https://orca-r9ui.onrender.com`;
  }
  return "https://orca-r9ui.onrender.com";
};

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = getBackendUrl();

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
