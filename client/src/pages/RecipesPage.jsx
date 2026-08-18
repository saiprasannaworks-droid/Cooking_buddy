import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import api from "../services/api.js";
import RecipeCard from "../components/recipe/RecipeCard.jsx";

const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setLoading(true);
    api
      .get("/recipes")
      .then((res) => {
        setRecipes(res.data.recipes || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load recipes:", err);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract unique cuisines dynamically from loaded recipes
  const availableCuisines = useMemo(() => {
    const set = new Set();
    recipes.forEach((r) => {
      if (r.cuisine) set.add(r.cuisine.trim());
    });
    return ["All", ...Array.from(set).sort()];
  }, [recipes]);

  // Filter & Sort recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        const matchesSearch =
          !search ||
          recipe.title?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.cuisine?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.ingredients?.some((item) =>
            item.ingredient?.name?.toLowerCase().includes(search.toLowerCase())
          );

        const matchesMeal =
          selectedMealType === "All" ||
          recipe.mealType?.toLowerCase() === selectedMealType.toLowerCase();

        const matchesDifficulty =
          selectedDifficulty === "All" ||
          recipe.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

        const matchesCuisine =
          selectedCuisine === "All" ||
          recipe.cuisine?.toLowerCase() === selectedCuisine.toLowerCase();

        return matchesSearch && matchesMeal && matchesDifficulty && matchesCuisine;
      })
      .sort((a, b) => {
        if (sortBy === "quickest") {
          const timeA = (a.prepTime || 0) + (a.cookTime || 0);
          const timeB = (b.prepTime || 0) + (b.cookTime || 0);
          return timeA - timeB;
        }
        if (sortBy === "calories") {
          return (a.calories || 0) - (b.calories || 0);
        }
        if (sortBy === "servings") {
          return (b.servings || 0) - (a.servings || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [recipes, search, selectedMealType, selectedDifficulty, selectedCuisine, sortBy]);

  const hasActiveFilters =
    search !== "" ||
    selectedMealType !== "All" ||
    selectedDifficulty !== "All" ||
    selectedCuisine !== "All" ||
    sortBy !== "default";

  const clearFilters = () => {
    setSearch("");
    setSelectedMealType("All");
    setSelectedDifficulty("All");
    setSelectedCuisine("All");
    setSortBy("default");
  };

  return (
    <section className="section recipes-page">
      <div className="container">
        {/* Page Header */}
        <div className="recipes-header">
          <p className="eyebrow">
            <Sparkles size={14} /> Curated Kitchen Collection
          </p>
          <h1 className="recipes-title">Explore All Recipes</h1>
          <p className="recipes-subtitle">
            From quick 15-minute weeknight dinners to weekend baking projects,
            find dishes tailored to your taste.
          </p>
        </div>

        {/* Filter Control Bar */}
        <div className="filter-panel">
          {/* Top Row: Search & Sort */}
          <div className="filter-panel__top">
            <div className="search-input-group">
              <Search className="search-icon" size={19} />
              <input
                type="text"
                placeholder="Search by recipe name, ingredient, cuisine..."
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

            <div className="sort-group">
              <SlidersHorizontal size={16} />
              <label htmlFor="sort-select" className="sr-only">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="default">Default order</option>
                <option value="quickest">Quickest cook time</option>
                <option value="calories">Lowest calories</option>
                <option value="servings">Most servings</option>
                <option value="newest">Recently added</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Filter Pills */}
          <div className="filter-pills-row">
            {/* Meal Type Pills */}
            <div className="pill-group">
              <span className="pill-group__label">Meal:</span>
              <div className="pill-group__items">
                {MEAL_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`filter-pill ${selectedMealType === type ? "filter-pill--active" : ""}`}
                    onClick={() => setSelectedMealType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Pills */}
            <div className="pill-group">
              <span className="pill-group__label">Difficulty:</span>
              <div className="pill-group__items">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`filter-pill ${selectedDifficulty === diff ? "filter-pill--active" : ""}`}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Select if available */}
            {availableCuisines.length > 2 && (
              <div className="pill-group">
                <span className="pill-group__label">Cuisine:</span>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="cuisine-select"
                >
                  {availableCuisines.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All Cuisines" : c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="results-meta">
          <p className="results-count">
            Showing <strong>{filteredRecipes.length}</strong> {filteredRecipes.length === 1 ? "recipe" : "recipes"}
            {hasActiveFilters && " matching your filters"}
          </p>
        </div>

        {/* Recipe Grid or Empty State */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="recipe-skeleton" />
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">🍳</div>
            <h3>No recipes matched your search</h3>
            <p>Try adjusting your search terms, changing the cuisine, or resetting your filters.</p>
            <button
              type="button"
              className="button button--secondary"
              onClick={clearFilters}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecipesPage;
