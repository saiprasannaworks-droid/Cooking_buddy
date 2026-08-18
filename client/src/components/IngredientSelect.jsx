import { useEffect, useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import api from "../services/api.js";

const COMMON_UNITS = [
  "grams",
  "kg",
  "ml",
  "liters",
  "cups",
  "tbsp",
  "tsp",
  "cloves",
  "pieces",
  "slices",
  "pinch",
  "to taste",
];

function IngredientSelect({ value = [], onChange }) {
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ingredients")
      .then((res) => {
        setAllIngredients(res.data.ingredients || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load ingredients for selector:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateRow = (index, field, val) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const addRow = () => {
    onChange([...value, { ingredient: "", quantity: "", unit: "grams" }]);
  };

  const removeRow = (index) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="recipe-ingredient-builder">
      <div className="builder-header">
        <div>
          <h3>Recipe Ingredients ({value.length})</h3>
          <p>Choose pantry ingredients and specify the exact quantity needed.</p>
        </div>
        <button
          type="button"
          className="button button--secondary button--sm"
          onClick={addRow}
        >
          <Plus size={14} /> Add Ingredient
        </button>
      </div>

      {value.length === 0 ? (
        <div className="empty-ingredients-hint">
          <p>No ingredients added yet.</p>
          <button
            type="button"
            className="button button--secondary"
            onClick={addRow}
          >
            <Plus size={14} /> Add first ingredient
          </button>
        </div>
      ) : (
        <div className="ingredient-rows-container">
          {value.map((row, idx) => (
            <div key={idx} className="ingredient-builder-row">
              {/* Ingredient Dropdown */}
              <div className="builder-field builder-field--select">
                <label className="field-label">Ingredient</label>
                <select
                  value={row.ingredient}
                  onChange={(e) => updateRow(idx, "ingredient", e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">-- Choose ingredient --</option>
                  {allIngredients.map((ing) => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name} {ing.category ? `(${ing.category})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="builder-field builder-field--qty">
                <label className="field-label">Amount / Qty</label>
                <input
                  type="text"
                  placeholder="e.g. 2, 200, 1/2"
                  value={row.quantity}
                  onChange={(e) => updateRow(idx, "quantity", e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              {/* Unit */}
              <div className="builder-field builder-field--unit">
                <label className="field-label">Unit</label>
                <input
                  type="text"
                  list={`units-list-${idx}`}
                  placeholder="e.g. grams, cups"
                  value={row.unit}
                  onChange={(e) => updateRow(idx, "unit", e.target.value)}
                  required
                  className="form-control"
                />
                <datalist id={`units-list-${idx}`}>
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
              </div>

              {/* Remove button */}
              <div className="builder-field builder-field--action">
                <button
                  type="button"
                  className="action-btn action-btn--delete"
                  onClick={() => removeRow(idx)}
                  title="Remove this ingredient"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientSelect;
