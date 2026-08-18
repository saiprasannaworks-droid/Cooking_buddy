import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import mongoose from "mongoose";

const invalidRecipeId = (recipeId) => !mongoose.isValidObjectId(recipeId);

export const addFavorite = async (req, res) => {
  try {
    if (invalidRecipeId(req.params.recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    const recipe = await Recipe.exists({ _id: req.params.recipeId });
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const user = await User.findById(req.user._id);

    if (!user.favorites.some((favorite) => favorite.equals(req.params.recipeId))) {
      user.favorites.push(req.params.recipeId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    if (invalidRecipeId(req.params.recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.recipeId
    );

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites"
    );

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
