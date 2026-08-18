import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Clock3, Users, Flame, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";

function RecipeCard({ recipe, matchData = null, onFavoriteToggled }) {
  const { user, isFavorite, toggleFavorite } = useContext(AuthContext);
  const [favLoading, setFavLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(recipe._id);
  const totalTime = recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please log in to save recipes to your favorites!");
      return;
    }

    setFavLoading(true);
    const result = await toggleFavorite(recipe._id);
    setFavLoading(false);
    if (onFavoriteToggled) {
      onFavoriteToggled(recipe._id, result?.isFav);
    }
  };

  const getDifficultyClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "badge--easy";
      case "medium":
        return "badge--medium";
      case "hard":
        return "badge--hard";
      default:
        return "badge--easy";
    }
  };

  const hasImage = recipe.image?.url && !imageError;

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe._id}`} className="recipe-card__link-wrapper">
        <div className="recipe-card__media">
          {hasImage ? (
            <img
              className="recipe-card__image"
              src={recipe.image.url}
              alt={recipe.title}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="recipe-card__image-placeholder">
              <span className="placeholder-icon">🍲</span>
              <span className="placeholder-text">{recipe.cuisine || "Homemade"}</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="recipe-card__badges-top">
            {recipe.cuisine && (
              <span className="badge badge--cuisine">{recipe.cuisine}</span>
            )}
            {recipe.mealType && (
              <span className="badge badge--meal">{recipe.mealType}</span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            className={`recipe-card__fav-btn ${favorited ? "recipe-card__fav-btn--active" : ""}`}
            onClick={handleFavoriteClick}
            disabled={favLoading}
            aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
            title={favorited ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart
              size={18}
              fill={favorited ? "currentColor" : "none"}
              className={favLoading ? "animate-pulse" : ""}
            />
          </button>

          {/* Match percentage pill if rendered in match results */}
          {matchData && (
            <div className="recipe-card__match-banner">
              <Sparkles size={14} />
              <span>{matchData.matchPercentage}% Match</span>
            </div>
          )}
        </div>

        <div className="recipe-card__content">
          <div className="recipe-card__meta-header">
            {recipe.difficulty && (
              <span className={`badge ${getDifficultyClass(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.calories > 0 && (
              <span className="recipe-card__calorie-tag">
                <Flame size={13} /> {recipe.calories} kcal
              </span>
            )}
          </div>

          <h3 className="recipe-card__title">{recipe.title}</h3>

          <p className="recipe-card__desc">
            {recipe.description || "A delicious home-cooked recipe prepared with fresh ingredients."}
          </p>

          {/* Missing ingredients tag on Match View */}
          {matchData && matchData.missingIngredients?.length > 0 && (
            <div className="recipe-card__missing-box">
              <span className="missing-label">Missing ({matchData.missingIngredients.length}):</span>
              <span className="missing-items">
                {matchData.missingIngredients.slice(0, 3).map((m) => m.name).join(", ")}
                {matchData.missingIngredients.length > 3 ? "..." : ""}
              </span>
            </div>
          )}

          {matchData && matchData.missingIngredients?.length === 0 && (
            <div className="recipe-card__complete-box">
              <CheckCircle2 size={14} />
              <span>You have all ingredients!</span>
            </div>
          )}

          <div className="recipe-card__details">
            <span className="detail-item">
              <Clock3 size={15} />
              <strong>{totalTime || recipe.cookTime || 20} min</strong>
            </span>

            <span className="detail-item">
              <Users size={15} />
              <strong>{recipe.servings || 2} servings</strong>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default RecipeCard;