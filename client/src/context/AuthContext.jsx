/**
 * AuthContext.jsx
 * ----------------------------------------
 * Provides authentication state, methods, and favorites synchronization.
 */

import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // array of recipe IDs strings
  const [loading, setLoading] = useState(true);

  /**
   * Sync favorites state from user object
   */
  const syncFavoritesFromUser = (userData) => {
    if (userData?.favorites) {
      // Map favorites whether they are populated objects or ID strings
      const favIds = userData.favorites.map((fav) =>
        typeof fav === "object" ? fav._id : fav
      );
      setFavorites(favIds);
    } else {
      setFavorites([]);
    }
  };

  /**
   * Load user from backend using stored token.
   */
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setFavorites([]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      const userData = res.data.user || res.data;
      setUser(userData);
      syncFavoritesFromUser(userData);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // Listen for storage events (e.g. logout in another tab or token removal)
    const handleStorageChange = () => {
      loadUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUser]);

  /**
   * Login with credentials.
   */
  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      const userData = res.data.user;
      setUser(userData);
      syncFavoritesFromUser(userData);
    }
    return res.data;
  };

  /**
   * Register new account.
   */
  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      const userData = res.data.user;
      setUser(userData);
      syncFavoritesFromUser(userData);
    }
    return res.data;
  };

  /**
   * Logout clears token and user state.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFavorites([]);
  };

  /**
   * Check if a recipe ID is favorited
   */
  const isFavorite = (recipeId) => {
    if (!recipeId) return false;
    return favorites.includes(recipeId.toString());
  };

  /**
   * Toggle favorite for a given recipe ID
   */
  const toggleFavorite = async (recipeId) => {
    if (!user) {
      return { success: false, requireAuth: true };
    }

    const idStr = recipeId.toString();
    const currentlyFav = favorites.includes(idStr);

    // Optimistic update
    const updatedFavs = currentlyFav
      ? favorites.filter((id) => id !== idStr)
      : [...favorites, idStr];
    setFavorites(updatedFavs);

    try {
      if (currentlyFav) {
        await api.delete(`/favorites/${idStr}`);
      } else {
        await api.post(`/favorites/${idStr}`);
      }

      // Update user state favorites
      setUser((prev) => (prev ? { ...prev, favorites: updatedFavs } : prev));
      return { success: true, isFav: !currentlyFav };
    } catch (error) {
      // Rollback on failure
      setFavorites(favorites);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update favorites",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        favorites,
        loading,
        login,
        register,
        logout,
        loadUser,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
