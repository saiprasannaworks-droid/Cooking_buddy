import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock3,
  Users,
  Flame,
  Heart,
  Share2,
  Printer,
  Edit,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Utensils,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const DEFAULT_STORES = [
  { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
  { store: "Blinkit", url: "https://blinkit.com" },
  { store: "BigBasket", url: "https://www.bigbasket.com" },
  { store: "Zepto", url: "https://www.zeptonow.com" },
  { store: "Amazon Fresh", url: "https://www.amazon.in/alm/storefront" },
];

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useContext(AuthContext);
  const { addToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCheckedIngredients({});
    setCompletedSteps({});
    api
      .get(`/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data.recipe || res.data);
      })
      .catch((err) => {
        console.error("Failed to load recipe:", err);
        setRecipe(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const favorited = recipe ? isFavorite(recipe._id) : false;

  const handleFavorite = async () => {
    if (!user) {
      addToast("Please log in to save recipes to your favorites", "info");
      return;
    }
    const result = await toggleFavorite(recipe._id);
    if (result.success) {
      addToast(
        result.isFav ? "Saved to your favorites collection!" : "Removed from favorites",
        "success"
      );
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast("Recipe link copied to clipboard!", "success");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/recipes/${recipe._id}`);
      addToast("Recipe deleted successfully", "success");
      navigate("/recipes");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete recipe", "error");
      setDeleting(false);
    }
  };

  const handleStoreClick = async (storeName, url) => {
    // Non-blocking tracking request
    try {
      api.post(`/recipes/${recipe._id}/shopping-click`, { storeName }).catch(() => {});
    } catch {
      // ignore
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepCheck = (stepNum) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  if (loading) {
    return (
      <section className="section recipe-detail-section">
        <div className="container">
          <div className="detail-loading-skeleton">
            <div className="skeleton-line skeleton-line--eyebrow" />
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--desc" />
            <div className="skeleton-block skeleton-block--hero" />
          </div>
        </div>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="section recipe-detail-section">
        <div className="container text-center">
          <div className="empty-state-card">
            <div className="empty-state-icon">🍲</div>
            <h2>Recipe not found</h2>
            <p>The recipe you are looking for might have been moved or removed.</p>
            <Link to="/recipes" className="button button--primary">
              <ChevronLeft size={16} /> Back to all recipes
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const totalTime = recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isCreator = user && recipe.createdBy && (
    recipe.createdBy === user._id || recipe.createdBy?._id === user._id
  );
  const canModify = isAdmin || isCreator;

  const storesToDisplay =
    recipe.shoppingLinks && recipe.shoppingLinks.length > 0
      ? recipe.shoppingLinks
      : DEFAULT_STORES;

  return (
    <article className="section recipe-detail-section">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="recipe-detail__breadcrumb">
          <Link to="/recipes" className="breadcrumb-link">
            <ChevronLeft size={16} /> All Recipes
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{recipe.title}</span>
        </div>

        {/* Recipe Editorial Header */}
        <header className="recipe-detail__header">
          <div className="recipe-detail__badges">
            {recipe.cuisine && <span className="badge badge--cuisine">{recipe.cuisine}</span>}
            {recipe.mealType && <span className="badge badge--meal">{recipe.mealType}</span>}
            {recipe.difficulty && (
              <span className={`badge badge--${recipe.difficulty.toLowerCase()}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          <h1 className="recipe-detail__title">{recipe.title}</h1>

          {recipe.description && (
            <p className="recipe-detail__lead">{recipe.description}</p>
          )}

          {/* Quick Stats Bar */}
          <div className="recipe-quick-stats">
            <div className="stat-pill">
              <Clock3 size={18} className="stat-icon" />
              <div>
                <span className="stat-label">Total Time</span>
                <strong className="stat-val">{totalTime} min</strong>
              </div>
            </div>

            {recipe.prepTime > 0 && (
              <div className="stat-pill">
                <Clock3 size={18} className="stat-icon" />
                <div>
                  <span className="stat-label">Prep Time</span>
                  <strong className="stat-val">{recipe.prepTime} min</strong>
                </div>
              </div>
            )}

            <div className="stat-pill">
              <Clock3 size={18} className="stat-icon" />
              <div>
                <span className="stat-label">Cook Time</span>
                <strong className="stat-val">{recipe.cookTime} min</strong>
              </div>
            </div>

            <div className="stat-pill">
              <Users size={18} className="stat-icon" />
              <div>
                <span className="stat-label">Servings</span>
                <strong className="stat-val">{recipe.servings || 1} people</strong>
              </div>
            </div>

            {recipe.calories > 0 && (
              <div className="stat-pill">
                <Flame size={18} className="stat-icon" />
                <div>
                  <span className="stat-label">Calories</span>
                  <strong className="stat-val">{recipe.calories} kcal</strong>
                </div>
              </div>
            )}
          </div>

          {/* Actions Toolbar */}
          <div className="recipe-detail__actions">
            <button
              type="button"
              className={`button ${favorited ? "button--primary" : "button--secondary"}`}
              onClick={handleFavorite}
            >
              <Heart size={17} fill={favorited ? "currentColor" : "none"} />
              {favorited ? "Saved in Favorites" : "Save Recipe"}
            </button>

            <button type="button" className="button button--secondary" onClick={handleShare}>
              <Share2 size={16} /> Share
            </button>

            <button type="button" className="button button--secondary" onClick={handlePrint}>
              <Printer size={16} /> Print
            </button>

            {canModify && (
              <div className="admin-actions-group">
                <Link
                  to={`/recipes/${recipe._id}/edit`}
                  className="button button--secondary"
                >
                  <Edit size={16} /> Edit Recipe
                </Link>
                <button
                  type="button"
                  className="button button--ghost text-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Layout (2 Columns) */}
        <div className="recipe-detail__layout">
          {/* Left Column: Image, Nutrition & Shopping */}
          <aside className="recipe-detail__sidebar">
            <div className="recipe-detail__image-card">
              {recipe.image?.url ? (
                <img
                  src={recipe.image.url}
                  alt={recipe.title}
                  className="recipe-detail__image"
                />
              ) : (
                <div className="recipe-detail__image-placeholder">
                  <Utensils size={48} />
                  <span>{recipe.title}</span>
                </div>
              )}
            </div>

            {/* Nutrition Information Card */}
            {recipe.nutrition && (
              <div className="sidebar-card nutrition-card">
                <h3>
                  <Sparkles size={16} /> Nutrition per Serving
                </h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-name">Calories</span>
                    <strong className="nutrition-val">{recipe.calories || 0} kcal</strong>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-name">Protein</span>
                    <strong className="nutrition-val">{recipe.nutrition.protein || 0}g</strong>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-name">Carbs</span>
                    <strong className="nutrition-val">{recipe.nutrition.carbs || 0}g</strong>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-name">Fat</span>
                    <strong className="nutrition-val">{recipe.nutrition.fat || 0}g</strong>
                  </div>
                  {recipe.nutrition.fiber > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-name">Fiber</span>
                      <strong className="nutrition-val">{recipe.nutrition.fiber}g</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shopping & Store Links with Click Tracking */}
            <div className="sidebar-card shopping-card">
              <h3>
                <ShoppingBag size={17} /> Order Ingredients Online
              </h3>
              <p className="shopping-note">
                Get fresh ingredients delivered directly to your doorstep in 10-20 minutes:
              </p>
              <div className="shopping-links-list">
                {storesToDisplay.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStoreClick(link.store, link.url)}
                    className="shopping-link-btn"
                  >
                    <span>{link.store || "Quick Grocery Partner"}</span>
                    <ExternalLink size={14} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column: Ingredients Checklist & Cooking Steps */}
          <main className="recipe-detail__main">
            {/* Ingredients Checklist */}
            <section className="detail-section ingredients-section">
              <div className="section-title-wrap">
                <h2>Ingredients</h2>
                <span className="section-hint">Click items to check off as you prepare</span>
              </div>

              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="ingredient-checklist">
                  {recipe.ingredients.map((item, idx) => {
                    const ingObj = item.ingredient;
                    const isChecked = !!checkedIngredients[idx];

                    return (
                      <li
                        key={idx}
                        className={`checklist-item ${isChecked ? "checklist-item--checked" : ""}`}
                        onClick={() => toggleIngredientCheck(idx)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredientCheck(idx)}
                          className="checklist-checkbox"
                          id={`ing-${idx}`}
                        />
                        <label htmlFor={`ing-${idx}`} className="checklist-label">
                          <span className="ingredient-qty">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="ingredient-title">
                            {typeof ingObj === "object" ? ingObj?.name : "Ingredient"}
                          </span>
                          {ingObj?.isAllergen && (
                            <span className="allergen-tag" title={`Allergen: ${ingObj.allergenType}`}>
                              <AlertTriangle size={12} /> {ingObj.allergenType || "Allergen"}
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty-section-hint">No ingredients listed for this recipe yet.</p>
              )}
            </section>

            {/* Step-by-Step Instructions */}
            <section className="detail-section instructions-section">
              <div className="section-title-wrap">
                <h2>Preparation Steps</h2>
                <span className="section-hint">
                  {recipe.instructions?.length || 0} cooking steps
                </span>
              </div>

              {recipe.instructions && recipe.instructions.length > 0 ? (
                <div className="instructions-list">
                  {recipe.instructions.map((step) => {
                    const isDone = !!completedSteps[step.step];

                    return (
                      <div
                        key={step.step}
                        className={`instruction-step ${isDone ? "instruction-step--done" : ""}`}
                        onClick={() => toggleStepCheck(step.step)}
                      >
                        <div className="step-number-bubble">
                          {isDone ? <CheckCircle2 size={18} /> : step.step}
                        </div>
                        <div className="step-content">
                          <p className="step-description">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="empty-section-hint">No preparation steps listed yet.</p>
              )}
            </section>

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="recipe-tags-wrap">
                <span className="tags-label">Tags:</span>
                <div className="tags-list">
                  {recipe.tags.map((tag, idx) => (
                    <span key={idx} className="recipe-tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </article>
  );
}

export default RecipeDetailPage;
