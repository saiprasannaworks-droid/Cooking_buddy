import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on a protected route, token is likely expired
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        error.config.url?.includes("/auth/login") ||
        error.config.url?.includes("/auth/register");

      if (!isAuthRoute && localStorage.getItem("token")) {
        localStorage.removeItem("token");
        // Optionally notify window event for auth listener
        window.dispatchEvent(new Event("storage"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
