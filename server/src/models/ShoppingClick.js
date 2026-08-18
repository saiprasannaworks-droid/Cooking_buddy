import mongoose from "mongoose";

const shoppingClickSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },

    storeName: String,

    clickedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShoppingClick", shoppingClickSchema);