import Recipe from "../models/Recipe.js";
import Ingredient from "../models/Ingredient.js";
import ShoppingClick from "../models/ShoppingClick.js";
import { deleteImage, uploadImage } from "../config/cloudinary.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const parseJsonFields = (data, fields) => {
  const parsedData = { ...data };

  for (const field of fields) {
    if (typeof parsedData[field] === "string") {
      try {
        parsedData[field] = JSON.parse(parsedData[field]);
      } catch (e) {
        // Keep string if already plain
      }
    }
  }

  return parsedData;
};

const validateIngredients = async (ingredients) => {
  if (!Array.isArray(ingredients)) {
    const error = new Error("Ingredients must be an array");
    error.statusCode = 400;
    throw error;
  }

  const ingredientIds = ingredients.map((item) => item.ingredient);
  if (ingredientIds.some((id) => !mongoose.isValidObjectId(id))) {
    const error = new Error("Each recipe ingredient must reference a valid ingredient ID");
    error.statusCode = 400;
    throw error;
  }

  const uniqueIngredientIds = [...new Set(ingredientIds.map(String))];
  const existingCount = await Ingredient.countDocuments({
    _id: { $in: uniqueIngredientIds },
  });

  if (existingCount !== uniqueIngredientIds.length) {
    const error = new Error("One or more ingredients do not exist");
    error.statusCode = 400;
    throw error;
  }
};

const errorStatus = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error instanceof SyntaxError || error.name === "ValidationError" || error.name === "CastError") return 400;
  if (error.code === 11000) return 409;
  return 500;
};

export const createRecipe = async (req, res) => {
  let uploadedImagePublicId;

  try {
    const recipeData = parseJsonFields(req.body, [
      "ingredients",
      "instructions",
      "nutrition",
      "tags",
      "shoppingLinks",
    ]);

    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      await validateIngredients(recipeData.ingredients);
    }

    // Add uploaded Cloudinary image
    if (req.file) {
      const result = await uploadImage(req.file.buffer);

      recipeData.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      uploadedImagePublicId = result.public_id;
    }

    // Store the logged-in user as the recipe creator
    recipeData.createdBy = req.user._id;

    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully.",
      recipe,
    });
  } catch (error) {
    if (uploadedImagePublicId) {
      try {
        await deleteImage(uploadedImagePublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded image:", cleanupError.message);
      }
    }

    res.status(errorStatus(error)).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("ingredients.ingredient").sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(req.params.id).populate(
      "ingredients.ingredient",
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Increment viewCount non-blockingly
    Recipe.findByIdAndUpdate(recipe._id, { $inc: { viewCount: 1 } }).exec();

    res.json({
      success: true,
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const matchRecipes = async (req, res) => {
  try {
    const { ingredientIds } = req.body;

    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide ingredients",
      });
    }

    const recipes = await Recipe.find().populate("ingredients.ingredient");

    const matchedRecipes = recipes.map((recipe) => {
      const recipeIngredients = recipe.ingredients
        .filter((item) => item.ingredient)
        .map((item) => item.ingredient._id.toString());

      const matchedIngredients = recipeIngredients.filter((id) =>
        ingredientIds.includes(id),
      );

      const missingIngredients = recipe.ingredients.filter(
        (item) => item.ingredient && !ingredientIds.includes(item.ingredient._id.toString()),
      );

      const matchPercentage = recipeIngredients.length
        ? Math.round((matchedIngredients.length / recipeIngredients.length) * 100)
        : 0;

      return {
        recipe,
        matchPercentage,
        matchedCount: matchedIngredients.length,
        totalIngredients: recipeIngredients.length,

        missingIngredients: missingIngredients.map((item) => ({
          id: item.ingredient._id,
          name: item.ingredient.name,
        })),
      };
    });

    // Sort best matches first
    matchedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      totalResults: matchedRecipes.length,
      recipes: matchedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Permission check: Creator or Admin
    const isOwner = recipe.createdBy && recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are only authorized to update recipes you created",
      });
    }

    const updateData = parseJsonFields(req.body, [
      "ingredients",
      "instructions",
      "nutrition",
      "tags",
      "shoppingLinks",
    ]);

    if (updateData.ingredients && updateData.ingredients.length > 0) {
      await validateIngredients(updateData.ingredients);
    }

    delete updateData.image;

    const previousImagePublicId = recipe.image?.public_id;
    recipe.set(updateData);

    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      recipe.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await recipe.save();

    let imageCleanup = { attempted: false, success: true };
    if (req.file && previousImagePublicId) {
      imageCleanup.attempted = true;
      try {
        const imageResult = await deleteImage(previousImagePublicId);
        imageCleanup.success = ["ok", "not found"].includes(imageResult.result);
      } catch (error) {
        imageCleanup.success = false;
        imageCleanup.message = error.message;
      }
    }

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe,
      imageCleanup,
    });
  } catch (error) {
    res.status(errorStatus(error)).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Permission check: Creator or Admin
    const isOwner = recipe.createdBy && recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are only authorized to delete recipes you created",
      });
    }

    if (recipe.image?.public_id) {
      try {
        await deleteImage(recipe.image.public_id);
      } catch (e) {
        console.error("Image deletion skipped:", e.message);
      }
    }

    await User.updateMany(
      { favorites: recipe._id },
      { $pull: { favorites: recipe._id } },
    );
    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Track shopping affiliate clicks for analytics & monetization
 */
export const trackShoppingClick = async (req, res) => {
  try {
    const { id } = req.params;
    const { storeName } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // Increment click count on recipe
    recipe.clickCount = (recipe.clickCount || 0) + 1;
    await recipe.save();

    // Save individual shopping click record
    const click = await ShoppingClick.create({
      recipe: recipe._id,
      user: req.user?._id || null,
      storeName: storeName || "Grocery Store",
      clickedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Shopping click tracked successfully",
      totalClicks: recipe.clickCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to track shopping click",
    });
  }
};
