import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, Sparkles, ChefHat, ArrowRight } from "lucide-react";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import RecipeCard from "../components/recipe/RecipeCard.jsx";

function FavoritesPage() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFavorites = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get("/favorites")
      .then((res) => {
        setFavorites(res.data.favorites || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load favorites:", err);
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleFavoriteToggled = (recipeId, isFav) => {
    if (!isFav) {
      // Optimistically remove from favorites page list
      setFavorites((prev) => prev.filter((r) => r._id !== recipeId));
    }
  };

  const filteredFavorites = useMemo(() => {
    return favorites.filter((recipe) => {
      if (!recipe) return false;
      const term = search.toLowerCase();
      return (
        !search ||
        recipe.title?.toLowerCase().includes(term) ||
        recipe.cuisine?.toLowerCase().includes(term) ||
        recipe.mealType?.toLowerCase().includes(term)
      );
    });
  }, [favorites, search]);

  if (!user) {
    return (
      <section className="section favorites-page">
        <div className="container text-center">
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <Heart size={44} className="text-coral" />
            </div>
            <h2>Save Your Favorite Dishes</h2>
            <p>
              Sign in to your Cooking Buddy account to bookmark recipes you love
              and access them anytime.
            </p>
            <div className="auth-cta-buttons">
              <Link to="/login" className="button button--primary">
                Sign In
              </Link>
              <Link to="/register" className="button button--secondary">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section favorites-page">
      <div className="container">
        {/* Header */}
        <div className="favorites-header">
          <p className="eyebrow">
            <Heart size={14} fill="currentColor" /> Personal Cookbook
          </p>
          <h1 className="favorites-title">Your Saved Recipes</h1>
          <p className="favorites-subtitle">
            Every dish worth repeating. Quickly access your tried-and-true favorites.
          </p>
        </div>

        {/* Toolbar when user has items */}
        {favorites.length > 0 && (
          <div className="favorites-toolbar">
            <div className="search-input-group">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search your saved recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="favorites-count-badge">
              <strong>{filteredFavorites.length}</strong> {filteredFavorites.length === 1 ? "recipe saved" : "recipes saved"}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="recipe-skeleton" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">📖</div>
            <h2>Your collection is currently empty</h2>
            <p>
              When you find a recipe you love, click the heart icon on any dish to save it here.
            </p>
            <Link to="/recipes" className="button button--primary">
              <span>Explore Recipes</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">🔍</div>
            <h3>No saved recipes match "{search}"</h3>
            <p>Try searching for a different keyword or meal type.</p>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setSearch("")}
            >
              Show all saved recipes
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredFavorites.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onFavoriteToggled={handleFavoriteToggled}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FavoritesPage;
