import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import Ingredient from "../models/Ingredient.js";
import ShoppingClick from "../models/ShoppingClick.js";

/**
 * Get dashboard statistics and shopping analytics for admin overview
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      recipeCount,
      userCount,
      ingredientCount,
      shoppingClickCount,
      usersWithFavorites,
      recentRecipes,
      recentUsers,
      storeBreakdown,
      topClickedRecipes,
    ] = await Promise.all([
      Recipe.countDocuments(),
      User.countDocuments(),
      Ingredient.countDocuments(),
      ShoppingClick.countDocuments(),
      User.find({}, "favorites"),
      Recipe.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title mealType cuisine difficulty createdAt image clickCount"),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt"),
      ShoppingClick.aggregate([
        { $group: { _id: "$storeName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Recipe.find({ clickCount: { $gt: 0 } })
        .sort({ clickCount: -1 })
        .limit(5)
        .select("title clickCount cuisine mealType"),
    ]);

    const totalFavorites = usersWithFavorites.reduce(
      (acc, curr) => acc + (curr.favorites ? curr.favorites.length : 0),
      0
    );

    res.json({
      success: true,
      stats: {
        recipes: recipeCount,
        users: userCount,
        ingredients: ingredientCount,
        favorites: totalFavorites,
        shoppingClicks: shoppingClickCount,
      },
      storeBreakdown: storeBreakdown.map((s) => ({
        storeName: s._id || "Other Stores",
        count: s.count,
      })),
      topClickedRecipes,
      recentRecipes,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin stats",
    });
  }
};

/**
 * Get all users with roles
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

/**
 * Update user role (promote to admin or demote to user)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};
