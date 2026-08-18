import mongoose from "mongoose";
import slugify from "slugify";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    image: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
      required: true,
      index: true,
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
      index: true,
    },

    prepTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    cookTime: {
      type: Number,
      required: true,
      min: 1,
    },

    servings: {
      type: Number,
      default: 1,
      min: 1,
    },

    calories: {
      type: Number,
      default: 0,
      min: 0,
    },

    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: String,
          trim: true,
        },
        unit: {
          type: String,
          trim: true,
        },
      },
    ],

    instructions: [
      {
        step: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    nutrition: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      sugar: { type: Number, default: 0 },
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    shoppingLinks: [
      {
        store: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],

    viewCount: {
      type: Number,
      default: 0,
    },

    saveCount: {
      type: Number,
      default: 0,
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

recipeSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

recipeSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Recipe", recipeSchema);

/*
|--------------------------------------------------------------------------
| Recipe Model Features
|--------------------------------------------------------------------------
| ✓ Production-ready Recipe Schema
| ✓ Automatic Slug Generation (slugify)
| ✓ SEO-Friendly URLs
| ✓ MongoDB Text Search Index
| ✓ Virtual Field (totalTime)
| ✓ Mongoose Pre-save Middleware
| ✓ Schema Validation
| ✓ Nutrition Information
| ✓ Ingredient References
| ✓ Shopping Links
| ✓ Analytics (Views, Saves, Clicks)
| ✓ Featured Recipes
| ✓ Draft / Published Status
| ✓ Automatic createdAt & updatedAt
| ✓ Cloudinary-ready Image Field
|--------------------------------------------------------------------------
*/
