import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
    },

    unit: {
      type: String,
    },

    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,

    isAllergen: {
      type: Boolean,
      default: false,
    },

    allergenType: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);