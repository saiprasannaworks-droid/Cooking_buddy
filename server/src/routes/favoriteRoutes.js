import express from "express";

import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:recipeId", protect, addFavorite);

router.delete("/:recipeId", protect, removeFavorite);

router.get("/", protect, getFavorites);

export default router;