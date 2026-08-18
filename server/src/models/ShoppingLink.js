import mongoose from "mongoose";

const shoppingLinkSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },

    storeName: String,

    url: String,
  },
  { timestamps: true }
);

export default mongoose.model("ShoppingLink", shoppingLinkSchema);