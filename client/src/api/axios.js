import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // global 401 handling optional
    if (err.response && err.response.status === 401) {
      // clear local auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // don't force navigate here; let caller handle
    }
    return Promise.reject(err);
  }
);

export default API;
