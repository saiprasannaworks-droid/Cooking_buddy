import express from "express";

import {
  createRecipe,
  getRecipes,
  getRecipeById,
  matchRecipes,
  updateRecipe,
  deleteRecipe,
  trackShoppingClick,
} from "../controllers/recipeController.js";

import { protect } from "../middleware/authMiddleware.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

const router = express.Router();

// Public recipe discovery & matching
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/match", matchRecipes);
router.post("/:id/shopping-click", trackShoppingClick);

// Authenticated recipe management (Users can manage own recipes, Admins can manage all)
router.post("/", protect, imageUpload.single("image"), createRecipe);
router.put("/:id", protect, imageUpload.single("image"), updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;
