import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ChefHat,
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  Sparkles,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import api from "../services/api.js";
import IngredientSelect from "../components/IngredientSelect.jsx";
import { useToast } from "../context/ToastContext.jsx";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function RecipeFormPage({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(edit);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    mealType: "Dinner",
    cuisine: "",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 350,
    ingredients: [{ ingredient: "", quantity: "1", unit: "tbsp" }],
    instructions: [
      { step: 1, description: "Prepare and wash all fresh ingredients." },
      { step: 2, description: "Heat pan over medium flame and combine ingredients." },
    ],
    nutrition: {
      protein: 15,
      carbs: 45,
      fat: 12,
      fiber: 4,
    },
    tagsString: "",
    shoppingLinks: [{ store: "Amazon Fresh", url: "" }],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (edit && id) {
      setLoading(true);
      api
        .get(`/recipes/${id}`)
        .then((res) => {
          const r = res.data.recipe || res.data;
          setForm({
            title: r.title || "",
            description: r.description || "",
            mealType: r.mealType || "Dinner",
            cuisine: r.cuisine || "",
            difficulty: r.difficulty || "Easy",
            prepTime: r.prepTime ?? 10,
            cookTime: r.cookTime ?? 20,
            servings: r.servings ?? 2,
            calories: r.calories ?? 350,
            ingredients:
              r.ingredients?.map((i) => ({
                ingredient: typeof i.ingredient === "object" ? i.ingredient?._id : i.ingredient,
                quantity: i.quantity || "",
                unit: i.unit || "",
              })) || [],
            instructions: r.instructions?.length
              ? r.instructions
              : [{ step: 1, description: "" }],
            nutrition: {
              protein: r.nutrition?.protein || 0,
              carbs: r.nutrition?.carbs || 0,
              fat: r.nutrition?.fat || 0,
              fiber: r.nutrition?.fiber || 0,
            },
            tagsString: (r.tags || []).join(", "),
            shoppingLinks: r.shoppingLinks?.length
              ? r.shoppingLinks
              : [{ store: "Amazon Fresh", url: "" }],
          });

          if (r.image?.url) {
            setImagePreview(r.image.url);
          }
        })
        .catch((err) => {
          console.error("Failed to load recipe for edit:", err);
          addToast("Failed to load recipe", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [edit, id, addToast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Instruction steps management
  const updateInstruction = (idx, description) => {
    const next = [...form.instructions];
    next[idx] = { ...next[idx], description };
    setForm({ ...form, instructions: next });
  };

  const addInstruction = () => {
    const nextStepNum = form.instructions.length + 1;
    setForm({
      ...form,
      instructions: [...form.instructions, { step: nextStepNum, description: "" }],
    });
  };

  const removeInstruction = (idx) => {
    const next = form.instructions
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, step: i + 1 }));
    setForm({ ...form, instructions: next });
  };

  // Shopping links management
  const updateShoppingLink = (idx, field, val) => {
    const next = [...form.shoppingLinks];
    next[idx] = { ...next[idx], [field]: val };
    setForm({ ...form, shoppingLinks: next });
  };

  const addShoppingLink = () => {
    setForm({
      ...form,
      shoppingLinks: [...form.shoppingLinks, { store: "", url: "" }],
    });
  };

  const removeShoppingLink = (idx) => {
    const next = form.shoppingLinks.filter((_, i) => i !== idx);
    setForm({ ...form, shoppingLinks: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validIngredients = form.ingredients.filter((i) => i.ingredient && i.quantity);
    if (validIngredients.length === 0) {
      addToast("Please select at least one valid ingredient", "error");
      return;
    }

    const validInstructions = form.instructions
      .filter((s) => s.description.trim())
      .map((s, idx) => ({ step: idx + 1, description: s.description.trim() }));

    if (validInstructions.length === 0) {
      addToast("Please provide at least one cooking step", "error");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("mealType", form.mealType);
    formData.append("cuisine", form.cuisine.trim());
    formData.append("difficulty", form.difficulty);
    formData.append("prepTime", Number(form.prepTime) || 0);
    formData.append("cookTime", Number(form.cookTime) || 1);
    formData.append("servings", Number(form.servings) || 1);
    formData.append("calories", Number(form.calories) || 0);

    formData.append("ingredients", JSON.stringify(validIngredients));
    formData.append("instructions", JSON.stringify(validInstructions));
    formData.append("nutrition", JSON.stringify(form.nutrition));

    const tags = form.tagsString
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(tags));

    const validShopping = form.shoppingLinks.filter((s) => s.url.trim());
    formData.append("shoppingLinks", JSON.stringify(validShopping));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (edit) {
        await api.put(`/recipes/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast("Recipe updated successfully!", "success");
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post("/recipes", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast("Recipe created successfully!", "success");
        const newId = res.data.recipe?._id;
        navigate(newId ? `/recipes/${newId}` : "/recipes");
      }
    } catch (err) {
      console.error("Save recipe error:", err);
      addToast(err.response?.data?.message || "Failed to save recipe", "error");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section recipe-form-section">
        <div className="container">
          <p>Loading recipe details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section recipe-form-section">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="recipe-detail__breadcrumb">
          <Link to="/recipes" className="breadcrumb-link">
            <ChevronLeft size={16} /> All Recipes
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {edit ? `Edit ${form.title}` : "New Recipe"}
          </span>
        </div>

        {/* Header */}
        <div className="recipe-form-header">
          <p className="eyebrow">
            <Sparkles size={14} /> Recipe Studio
          </p>
          <h1>{edit ? "Edit Recipe" : "Create New Recipe"}</h1>
          <p className="recipe-form-subtitle">
            Publish a delicious recipe with step-by-step cooking instructions, pantry
            ingredients, and nutrition facts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="recipe-studio-form">
          {/* Section 1: Basic Information */}
          <div className="form-card">
            <h2 className="form-card__title">1. Basic Information</h2>

            <div className="form-group">
              <label className="field-label">Recipe Title *</label>
              <input
                type="text"
                placeholder="e.g. Creamy Tuscan Garlic Butter Pasta"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="field-label">Short Description *</label>
              <textarea
                placeholder="Write a brief, appetizing summary of this dish..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                className="form-control"
              />
            </div>

            <div className="form-row form-row--3">
              <div className="form-group">
                <label className="field-label">Meal Type *</label>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  className="form-control"
                  required
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Cuisine *</label>
                <input
                  type="text"
                  placeholder="e.g. Italian, Mexican, Indian"
                  value={form.cuisine}
                  onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Difficulty *</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="form-control"
                  required
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Timing, Servings & Calories */}
          <div className="form-card">
            <h2 className="form-card__title">2. Timing & Servings</h2>

            <div className="form-row form-row--4">
              <div className="form-group">
                <label className="field-label">Prep Time (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={form.prepTime}
                  onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Cook Time (mins) *</label>
                <input
                  type="number"
                  min="1"
                  value={form.cookTime}
                  onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Servings (people)</label>
                <input
                  type="number"
                  min="1"
                  value={form.servings}
                  onChange={(e) => setForm({ ...form, servings: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Calories (kcal)</label>
                <input
                  type="number"
                  min="0"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Recipe Photo */}
          <div className="form-card">
            <h2 className="form-card__title">3. Recipe Photography</h2>
            <div className="image-upload-wrapper">
              {imagePreview ? (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="Recipe Preview" />
                  <label htmlFor="recipe-image-file" className="button button--secondary button--sm change-photo-btn">
                    Change photo
                  </label>
                </div>
              ) : (
                <div className="image-dropzone">
                  <ImageIcon size={38} className="dropzone-icon" />
                  <h3>Upload Delicious Recipe Photo</h3>
                  <p>PNG, JPG, or WEBP up to 5MB</p>
                  <label htmlFor="recipe-image-file" className="button button--secondary">
                    Browse File
                  </label>
                </div>
              )}
              <input
                type="file"
                id="recipe-image-file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-hidden"
              />
            </div>
          </div>

          {/* Section 4: Ingredients List */}
          <div className="form-card">
            <h2 className="form-card__title">4. Ingredients</h2>
            <IngredientSelect
              value={form.ingredients}
              onChange={(ingredients) => setForm({ ...form, ingredients })}
            />
          </div>

          {/* Section 5: Preparation Steps */}
          <div className="form-card">
            <div className="builder-header">
              <div>
                <h2 className="form-card__title">5. Cooking Steps ({form.instructions.length})</h2>
                <p>Provide clear numbered instructions for home cooks.</p>
              </div>
              <button
                type="button"
                className="button button--secondary button--sm"
                onClick={addInstruction}
              >
                <Plus size={14} /> Add Step
              </button>
            </div>

            <div className="instructions-builder-list">
              {form.instructions.map((step, idx) => (
                <div key={idx} className="instruction-builder-row">
                  <div className="step-badge-num">{step.step}</div>
                  <div className="step-input-wrap">
                    <textarea
                      placeholder={`Step ${step.step} instructions...`}
                      value={step.description}
                      onChange={(e) => updateInstruction(idx, e.target.value)}
                      rows={2}
                      className="form-control"
                      required
                    />
                  </div>
                  {form.instructions.length > 1 && (
                    <button
                      type="button"
                      className="action-btn action-btn--delete"
                      onClick={() => removeInstruction(idx)}
                      title="Remove step"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Nutrition & Extras */}
          <div className="form-card">
            <h2 className="form-card__title">6. Nutrition & Tags</h2>

            <div className="form-row form-row--4">
              <div className="form-group">
                <label className="field-label">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  value={form.nutrition.protein}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: { ...form.nutrition, protein: Number(e.target.value) },
                    })
                  }
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  value={form.nutrition.carbs}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: { ...form.nutrition, carbs: Number(e.target.value) },
                    })
                  }
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Fat (g)</label>
                <input
                  type="number"
                  min="0"
                  value={form.nutrition.fat}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: { ...form.nutrition, fat: Number(e.target.value) },
                    })
                  }
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Fiber (g)</label>
                <input
                  type="number"
                  min="0"
                  value={form.nutrition.fiber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: { ...form.nutrition, fiber: Number(e.target.value) },
                    })
                  }
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group mt-16">
              <label className="field-label">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. quick, dinner, gluten-free, healthy"
                value={form.tagsString}
                onChange={(e) => setForm({ ...form, tagsString: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          {/* Section 7: Grocery / Shopping Links */}
          <div className="form-card">
            <div className="builder-header">
              <div>
                <h2 className="form-card__title">7. Grocery / Shopping Links (Optional)</h2>
                <p>Provide direct links for users to buy ingredients online.</p>
              </div>
              <button
                type="button"
                className="button button--secondary button--sm"
                onClick={addShoppingLink}
              >
                <Plus size={14} /> Add Link
              </button>
            </div>

            <div className="shopping-links-builder">
              {form.shoppingLinks.map((link, idx) => (
                <div key={idx} className="shopping-builder-row">
                  <input
                    type="text"
                    placeholder="Store Name (e.g. Amazon Fresh)"
                    value={link.store}
                    onChange={(e) => updateShoppingLink(idx, "store", e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="url"
                    placeholder="URL (e.g. https://amazon.com/...)"
                    value={link.url}
                    onChange={(e) => updateShoppingLink(idx, "url", e.target.value)}
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="action-btn action-btn--delete"
                    onClick={() => removeShoppingLink(idx)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="form-submit-bar">
            <Link to="/recipes" className="button button--secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="button button--primary submit-main-btn"
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? "Saving Recipe..." : edit ? "Save Changes" : "Publish Recipe"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RecipeFormPage;
