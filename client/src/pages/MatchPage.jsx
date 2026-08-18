import { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Search,
  Check,
  X,
  ChefHat,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import api from "../services/api.js";
import RecipeCard from "../components/recipe/RecipeCard.jsx";

const CATEGORIES = [
  "All",
  "Vegetables",
  "Proteins",
  "Dairy",
  "Pantry & Spices",
  "Grains & Bakery",
  "Fruits",
];

function MatchPage() {
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingIngredients, setFetchingIngredients] = useState(true);
  const [minMatchThreshold, setMinMatchThreshold] = useState(0); // 0%, 50%, 75%, 100%

  useEffect(() => {
    setFetchingIngredients(true);
    api
      .get("/ingredients")
      .then((res) => {
        setAllIngredients(res.data.ingredients || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load ingredients:", err);
      })
      .finally(() => setFetchingIngredients(false));
  }, []);

  // Filter ingredients by category and search text
  const visibleIngredients = useMemo(() => {
    return allIngredients.filter((item) => {
      const matchesSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());

      const itemCategory = item.category?.toLowerCase() || "";
      const matchesCat =
        activeCategory === "All" ||
        (activeCategory === "Vegetables" && itemCategory.includes("veg")) ||
        (activeCategory === "Proteins" &&
          (itemCategory.includes("meat") ||
            itemCategory.includes("protein") ||
            itemCategory.includes("poultry") ||
            itemCategory.includes("seafood"))) ||
        (activeCategory === "Dairy" &&
          (itemCategory.includes("dairy") || itemCategory.includes("cheese"))) ||
        (activeCategory === "Pantry & Spices" &&
          (itemCategory.includes("spice") ||
            itemCategory.includes("oil") ||
            itemCategory.includes("sauce") ||
            itemCategory.includes("condiment"))) ||
        (activeCategory === "Grains & Bakery" &&
          (itemCategory.includes("grain") ||
            itemCategory.includes("pasta") ||
            itemCategory.includes("bread") ||
            itemCategory.includes("flour"))) ||
        (activeCategory === "Fruits" && itemCategory.includes("fruit"));

      return matchesSearch && matchesCat;
    });
  }, [allIngredients, search, activeCategory]);

  const toggleIngredient = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeIngredient = (id) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const clearAllSelected = () => {
    setSelectedIds([]);
    setMatches(null);
  };

  const handleFindMatches = async () => {
    if (selectedIds.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post("/recipes/match", {
        ingredientIds: selectedIds,
      });
      setMatches(res.data.recipes || []);
    } catch (err) {
      console.error("Match error:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter matched results by minimum match threshold
  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter((m) => m.matchPercentage >= minMatchThreshold);
  }, [matches, minMatchThreshold]);

  const fullMatchesCount = useMemo(() => {
    if (!matches) return 0;
    return matches.filter((m) => m.matchPercentage === 100).length;
  }, [matches]);

  return (
    <section className="section match-page">
      <div className="container">
        {/* Page Hero */}
        <div className="match-header">
          <p className="eyebrow">
            <Sparkles size={14} /> Zero-Waste Kitchen Assistant
          </p>
          <h1 className="match-title">Cook with what you have</h1>
          <p className="match-subtitle">
            Pick ingredients currently in your pantry and fridge. We will find
            delicious recipes you can make right now, ranked by completeness.
          </p>
        </div>

        {/* Interactive Pantry Selection Card */}
        <div className="pantry-card">
          <div className="pantry-card__header">
            <div>
              <h2>Your Kitchen Pantry</h2>
              <p>Select ingredients to add to your cooking basket</p>
            </div>

            {selectedIds.length > 0 && (
              <button
                type="button"
                className="clear-pantry-btn"
                onClick={clearAllSelected}
              >
                <RotateCcw size={14} /> Clear all ({selectedIds.length})
              </button>
            )}
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="pantry-toolbar">
            <div className="pantry-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search ingredients (e.g. Garlic, Tomato, Butter)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

            <div className="pantry-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${activeCategory === cat ? "category-pill--active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Basket Tray */}
          {selectedIds.length > 0 && (
            <div className="selected-basket-tray">
              <span className="basket-label">
                In your basket ({selectedIds.length}):
              </span>
              <div className="basket-chips">
                {selectedIds.map((id) => {
                  const ing = allIngredients.find((i) => i._id === id);
                  if (!ing) return null;
                  return (
                    <span key={id} className="basket-chip">
                      <span>{ing.name}</span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(id)}
                        aria-label={`Remove ${ing.name}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Ingredients Grid */}
          <div className="ingredients-selector-area">
            {fetchingIngredients ? (
              <div className="ingredients-loading">Loading ingredients list...</div>
            ) : visibleIngredients.length === 0 ? (
              <div className="ingredients-empty">
                No ingredients found matching "{search}".
              </div>
            ) : (
              <div className="ingredient-chip-grid">
                {visibleIngredients.map((item) => {
                  const isSelected = selectedIds.includes(item._id);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      className={`ingredient-select-chip ${isSelected ? "ingredient-select-chip--selected" : ""}`}
                      onClick={() => toggleIngredient(item._id)}
                    >
                      <span className="chip-indicator">
                        {isSelected ? <Check size={14} /> : "+"}
                      </span>
                      <span className="chip-name">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Callout */}
          <div className="pantry-footer">
            <div className="pantry-footer__summary">
              <strong>{selectedIds.length}</strong> items chosen
            </div>

            <button
              type="button"
              className="button button--primary find-recipes-btn"
              onClick={handleFindMatches}
              disabled={selectedIds.length === 0 || loading}
            >
              <Sparkles size={17} />
              <span>{loading ? "Matching with recipes..." : "Find Matching Recipes"}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Matches Results Section */}
        {matches !== null && (
          <div className="match-results-section" id="match-results">
            <div className="match-results__header">
              <div>
                <h2>
                  Recipe Matches ({filteredMatches.length})
                </h2>
                <p>
                  {fullMatchesCount > 0
                    ? `🎉 You have 100% of ingredients for ${fullMatchesCount} recipe${fullMatchesCount > 1 ? "s" : ""}!`
                    : "Here are the closest recipes matching your kitchen pantry:"}
                </p>
              </div>

              {/* Match % threshold filter */}
              <div className="threshold-filter">
                <SlidersHorizontal size={15} />
                <span>Show:</span>
                <select
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="threshold-select"
                >
                  <option value={0}>All matches (Any %)</option>
                  <option value={50}>At least 50% match</option>
                  <option value={75}>At least 75% match</option>
                  <option value={100}>100% Complete match only</option>
                </select>
              </div>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">🔍</div>
                <h3>No recipes match this threshold</h3>
                <p>Try lowering the match filter or selecting a few more common ingredients (like olive oil, salt, garlic).</p>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => setMinMatchThreshold(0)}
                >
                  Show all matches
                </button>
              </div>
            ) : (
              <div className="recipe-grid">
                {filteredMatches.map((matchItem) => (
                  <RecipeCard
                    key={matchItem.recipe._id}
                    recipe={matchItem.recipe}
                    matchData={matchItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default MatchPage;
