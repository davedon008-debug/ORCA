import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
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
