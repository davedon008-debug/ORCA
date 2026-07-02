import axios from "axios";

export const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:5001`;
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
