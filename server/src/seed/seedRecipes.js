import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";

dotenv.config();

const sampleRecipes = [
  {
    title: "Traditional Hyderabadi Chicken Biryani",
    description:
      "A fragrant, layered spiced rice dish made with tender chicken, aged basmati rice, warm whole spices, and caramelized golden onions.",
    image: {
      url: "https://res.cloudinary.com/bamuziqr/image/upload/v1786368754/Cooking_Buddy/recipes/cfkitsyiae3beoixtt94.jpg",
      public_id: "Cooking_Buddy/recipes/cfkitsyiae3beoixtt94",
    },
    mealType: "Dinner",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    calories: 650,
    nutrition: { protein: 38, carbs: 72, fat: 22, fiber: 4, sugar: 3 },
    tags: ["biryani", "chicken", "dinner", "spicy", "rice", "festive"],
    featured: true,
    status: "published",
    ingredientRequirements: [
      { name: "Chicken", quantity: "500", unit: "grams" },
      { name: "Rice", quantity: "400", unit: "grams" },
      { name: "Onion", quantity: "2", unit: "pieces" },
      { name: "Yoghurt", quantity: "150", unit: "grams" },
      { name: "Garlic", quantity: "6", unit: "cloves" },
      { name: "Ginger", quantity: "20", unit: "grams" },
      { name: "Garam Masala", quantity: "1", unit: "tbsp" },
      { name: "Chilli Powder", quantity: "1", unit: "tsp" },
      { name: "Turmeric", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tbsp" },
      { name: "Butter", quantity: "2", unit: "tbsp" },
    ],
    instructions: [
      { step: 1, description: "Marinate chicken with yoghurt, ginger, garlic, chilli powder, turmeric, garam masala, and salt for at least 30 minutes." },
      { step: 2, description: "Slice onions thinly and fry in butter or oil until deep golden brown and crispy (birista)." },
      { step: 3, description: "Wash and soak basmati rice for 30 minutes. Parboil in salted water with whole spices until 70% cooked." },
      { step: 4, description: "Layer marinated chicken at the base of a heavy pot, top with parboiled rice, fried onions, and melted butter." },
      { step: 5, description: "Seal the pot tightly with foil (Dum cooking) and cook on low heat for 25-30 minutes." },
      { step: 6, description: "Let rest for 10 minutes before gently fluffing and serving hot with refreshing raita." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Amazon Fresh", url: "https://www.amazon.in/alm/storefront" },
    ],
  },
  {
    title: "Creamy Garlic Parmesan Pasta",
    description:
      "A rich, comforting 20-minute weeknight pasta tossed in a silky garlic, parmesan, and butter emulsion.",
    image: {
      url: "https://images.unsplash.com/photo-1621996346565-e3d5d62810a6?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Italian",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    calories: 480,
    nutrition: { protein: 16, carbs: 58, fat: 20, fiber: 3, sugar: 2 },
    tags: ["pasta", "italian", "quick", "vegetarian", "comfort food"],
    featured: true,
    status: "published",
    ingredientRequirements: [
      { name: "Pasta", quantity: "250", unit: "grams" },
      { name: "Garlic", quantity: "5", unit: "cloves" },
      { name: "Butter", quantity: "3", unit: "tbsp" },
      { name: "Cheese", quantity: "60", unit: "grams" },
      { name: "Milk", quantity: "120", unit: "ml" },
      { name: "Black Pepper", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Boil pasta in generously salted water until al dente. Reserve 1/2 cup of starchy cooking water." },
      { step: 2, description: "Melt butter in a large skillet over medium-low heat. Add finely sliced garlic and sauté until fragrant." },
      { step: 3, description: "Pour in milk, simmer for 2 minutes, then remove from heat and whisk in freshly grated cheese." },
      { step: 4, description: "Transfer drained pasta into the skillet. Toss vigorously while splashing pasta water to create a glossy emulsion." },
      { step: 5, description: "Season with coarse black pepper and serve immediately with extra parmesan." },
    ],
    shoppingLinks: [
      { store: "Zepto", url: "https://www.zeptonow.com" },
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
    ],
  },
  {
    title: "Paneer Butter Masala",
    description:
      "Soft cottage cheese cubes simmered in a velvety, mildly spiced gravy made with tomatoes, butter, and aromatic spices.",
    image: {
      url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Lunch",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    calories: 420,
    nutrition: { protein: 18, carbs: 22, fat: 28, fiber: 4, sugar: 6 },
    tags: ["paneer", "curry", "indian", "vegetarian", "restaurant-style"],
    featured: true,
    status: "published",
    ingredientRequirements: [
      { name: "Paneer", quantity: "250", unit: "grams" },
      { name: "Tomato", quantity: "4", unit: "pieces" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Butter", quantity: "40", unit: "grams" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Ginger", quantity: "15", unit: "grams" },
      { name: "Garam Masala", quantity: "1", unit: "tsp" },
      { name: "Chilli Powder", quantity: "1", unit: "tsp" },
      { name: "Sugar", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Roughly chop tomatoes, onions, ginger, and garlic. Sauté in 1 tbsp butter for 8 minutes until soft." },
      { step: 2, description: "Cool and blend into a super silky smooth puree, straining if needed." },
      { step: 3, description: "Melt remaining butter in the skillet, add spices, pour the puree, and simmer for 10 minutes until butter separates." },
      { step: 4, description: "Add a pinch of sugar, salt, and gently slide in fresh paneer cubes. Simmer for 4 minutes." },
      { step: 5, description: "Garnish with a drizzle of cream or butter and enjoy with warm naan or jeera rice." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
    ],
  },
  {
    title: "Classic Chicken Fried Rice",
    description:
      "Wok-tossed jasmine rice with tender chicken chunks, crisp vegetables, scrambled egg, and savory soy sauce.",
    image: {
      url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Asian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    calories: 520,
    nutrition: { protein: 32, carbs: 64, fat: 14, fiber: 3, sugar: 2 },
    tags: ["fried rice", "chicken", "asian", "quick", "takeout-style"],
    featured: true,
    status: "published",
    ingredientRequirements: [
      { name: "Rice", quantity: "350", unit: "grams" },
      { name: "Chicken", quantity: "250", unit: "grams" },
      { name: "Egg", quantity: "2", unit: "pieces" },
      { name: "Carrot", quantity: "1", unit: "pieces" },
      { name: "Peas", quantity: "60", unit: "grams" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Black Pepper", quantity: "1/2", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Cut chicken into small bite-sized cubes and season with salt and pepper." },
      { step: 2, description: "Heat oil in a wok on high flame. Sear chicken until cooked through (4-5 mins) and set aside." },
      { step: 3, description: "Scramble eggs in the wok, push to the side, then stir-fry minced garlic, carrots, and peas for 2 minutes." },
      { step: 4, description: "Add cold day-old cooked rice and cooked chicken. Drizzle soy sauce and toss everything on high heat." },
      { step: 5, description: "Season with fresh black pepper and serve hot." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Homestyle Fluffy Honey Pancakes",
    description:
      "Golden, pillowy breakfast pancakes served warm with whipped butter and pure organic honey.",
    image: {
      url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Breakfast",
    cuisine: "American",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    calories: 380,
    nutrition: { protein: 10, carbs: 62, fat: 11, fiber: 2, sugar: 18 },
    tags: ["pancakes", "breakfast", "sweet", "weekend", "kids"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Flour", quantity: "200", unit: "grams" },
      { name: "Milk", quantity: "220", unit: "ml" },
      { name: "Egg", quantity: "1", unit: "pieces" },
      { name: "Butter", quantity: "30", unit: "grams" },
      { name: "Honey", quantity: "3", unit: "tbsp" },
      { name: "Sugar", quantity: "1", unit: "tbsp" },
      { name: "Salt", quantity: "1/4", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Whisk flour, sugar, and salt together in a mixing bowl." },
      { step: 2, description: "In a separate bowl, whisk milk, egg, and melted butter. Combine wet and dry ingredients gently without overmixing." },
      { step: 3, description: "Heat a non-stick griddle over medium heat and grease lightly with butter." },
      { step: 4, description: "Pour 1/4 cup batter per pancake. Cook until bubbles form on top, flip and cook for 1-2 minutes more until golden." },
      { step: 5, description: "Stack warm pancakes, top with a pat of butter, and drizzle generously with honey." },
    ],
    shoppingLinks: [
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
    ],
  },
  {
    title: "Creamy Tomato Basil Soup",
    description:
      "A soothing, velvety soup made from ripe roasted tomatoes, fresh garlic, butter, and fragrant herbs.",
    image: {
      url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Lunch",
    cuisine: "American",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 220,
    nutrition: { protein: 5, carbs: 24, fat: 12, fiber: 4, sugar: 9 },
    tags: ["soup", "tomato", "vegetarian", "healthy", "comfort"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Tomato", quantity: "6", unit: "pieces" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Butter", quantity: "20", unit: "grams" },
      { name: "Milk", quantity: "80", unit: "ml" },
      { name: "Black Pepper", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Halve tomatoes and onions. Sauté in butter with smashed garlic cloves for 10 minutes until soft." },
      { step: 2, description: "Transfer to a blender and blitz until smooth and silky." },
      { step: 3, description: "Return soup to the saucepan, stir in milk, and simmer gently for 5 minutes." },
      { step: 4, description: "Season with salt and fresh cracked pepper. Serve hot alongside toasted crusty bread." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
    ],
  },
  {
    title: "Butter Garlic Sautéed Mushrooms",
    description:
      "Tender button mushrooms caramelized in browned garlic butter and seasoned with fresh black pepper.",
    image: {
      url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Snack",
    cuisine: "Continental",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 190,
    nutrition: { protein: 8, carbs: 9, fat: 14, fiber: 3, sugar: 2 },
    tags: ["mushrooms", "garlic", "keto", "appetizer", "quick"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Mushroom", quantity: "300", unit: "grams" },
      { name: "Garlic", quantity: "6", unit: "cloves" },
      { name: "Butter", quantity: "30", unit: "grams" },
      { name: "Olive Oil", quantity: "1", unit: "tbsp" },
      { name: "Black Pepper", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Wipe mushrooms clean and slice in halves or quarters." },
      { step: 2, description: "Heat olive oil and butter in a wide skillet over high heat." },
      { step: 3, description: "Add mushrooms in a single layer and let brown without stirring for 3 minutes." },
      { step: 4, description: "Toss in minced garlic, season with salt and pepper, and sauté for 2 more minutes until golden." },
      { step: 5, description: "Serve warm as a side dish, toast topping, or tapas snack." },
    ],
    shoppingLinks: [
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Street Style Egg Masala Omelette",
    description:
      "Fluffy, spiced Indian street-style omelette loaded with chopped onions, tomatoes, green chilies, and fresh coriander.",
    image: {
      url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Breakfast",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 6,
    servings: 1,
    calories: 260,
    nutrition: { protein: 15, carbs: 6, fat: 18, fiber: 1, sugar: 2 },
    tags: ["eggs", "omelette", "breakfast", "street food", "high protein"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Egg", quantity: "3", unit: "pieces" },
      { name: "Onion", quantity: "1/2", unit: "pieces" },
      { name: "Tomato", quantity: "1/2", unit: "pieces" },
      { name: "Chilli Powder", quantity: "1/2", unit: "tsp" },
      { name: "Turmeric", quantity: "1/4", unit: "tsp" },
      { name: "Garam Masala", quantity: "1/4", unit: "tsp" },
      { name: "Butter", quantity: "1", unit: "tbsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Finely dice onions and tomatoes." },
      { step: 2, description: "Crack eggs into a bowl, add spices, salt, and vegetables. Beat vigorously until frothy." },
      { step: 3, description: "Melt butter in a hot pan, pour egg mixture, and swirl to cover the pan." },
      { step: 4, description: "Cook on medium heat until edges set, then flip and cook the other side for 1 minute." },
      { step: 5, description: "Fold and serve hot with toasted buttered bread or chai." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
    ],
  },
  {
    title: "Golden Crispy French Toast",
    description:
      "Thick slices of bread dipped in vanilla cinnamon egg custard and pan-toasted in butter until caramelized.",
    image: {
      url: "https://images.unsplash.com/photo-1484723091739-004a82a6cf49?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Breakfast",
    cuisine: "American",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    calories: 340,
    nutrition: { protein: 12, carbs: 42, fat: 14, fiber: 2, sugar: 12 },
    tags: ["french toast", "breakfast", "sweet", "easy", "brunch"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Bread", quantity: "4", unit: "slices" },
      { name: "Egg", quantity: "2", unit: "pieces" },
      { name: "Milk", quantity: "80", unit: "ml" },
      { name: "Butter", quantity: "25", unit: "grams" },
      { name: "Sugar", quantity: "1", unit: "tbsp" },
      { name: "Honey", quantity: "2", unit: "tbsp" },
    ],
    instructions: [
      { step: 1, description: "Whisk eggs, milk, and sugar in a shallow wide dish until well blended." },
      { step: 2, description: "Melt butter in a non-stick skillet over medium flame." },
      { step: 3, description: "Dip bread slices in custard mixture for 10 seconds per side until saturated." },
      { step: 4, description: "Place in skillet and cook 3-4 minutes per side until golden brown and crispy." },
      { step: 5, description: "Serve warm drizzled with golden honey." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Vegetable Hakka Noodles",
    description:
      "Indo-Chinese street-style stir-fried noodles loaded with julienned cabbage, carrots, capsicum, and savory sauces.",
    image: {
      url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Asian",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 10,
    servings: 3,
    calories: 390,
    nutrition: { protein: 9, carbs: 68, fat: 9, fiber: 5, sugar: 4 },
    tags: ["noodles", "chinese", "vegan", "street food", "dinner"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Noodles", quantity: "250", unit: "grams" },
      { name: "Cabbage", quantity: "100", unit: "grams" },
      { name: "Carrot", quantity: "1", unit: "pieces" },
      { name: "Capsicum", quantity: "1", unit: "pieces" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Black Pepper", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Boil noodles al dente, drain, rinse with cold water, and toss with a few drops of oil." },
      { step: 2, description: "Finely julienne cabbage, carrots, capsicum, and slice onions." },
      { step: 3, description: "Heat oil in a hot wok. Sauté minced garlic and onions on high flame for 1 minute." },
      { step: 4, description: "Add shredded veggies and stir-fry for 2 minutes on high heat keeping them crunchy." },
      { step: 5, description: "Toss in boiled noodles, soy sauce, and black pepper. Mix vigorously and serve immediately." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
    ],
  },
  {
    title: "Creamy Coconut Chickpea Curry",
    description:
      "Hearty chickpeas simmered in a warm spiced coconut milk, tomato, and ginger curry. 100% plant-based and wholesome.",
    image: {
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Lunch",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    calories: 410,
    nutrition: { protein: 14, carbs: 48, fat: 18, fiber: 9, sugar: 4 },
    tags: ["chickpeas", "vegan", "coconut", "gluten-free", "healthy"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Chickpeas", quantity: "300", unit: "grams" },
      { name: "Coconut Milk", quantity: "200", unit: "ml" },
      { name: "Tomato", quantity: "2", unit: "pieces" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Ginger", quantity: "10", unit: "grams" },
      { name: "Turmeric", quantity: "1/2", unit: "tsp" },
      { name: "Garam Masala", quantity: "1", unit: "tsp" },
      { name: "Spinach", quantity: "50", unit: "grams" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté chopped onion, garlic, and ginger in a pot until soft and fragrant." },
      { step: 2, description: "Add diced tomatoes, turmeric, garam masala, and salt. Cook until tomatoes break down into a paste." },
      { step: 3, description: "Add cooked chickpeas and pour in coconut milk. Bring to a gentle simmer for 10 minutes." },
      { step: 4, description: "Stir in fresh spinach leaves and let wilt in the residual heat." },
      { step: 5, description: "Serve warm with steamed basmati rice or flatbread." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Amazon Fresh", url: "https://www.amazon.in/alm/storefront" },
    ],
  },
  {
    title: "Palak Paneer (Spinach Cottage Cheese)",
    description:
      "A classic North Indian delicacy featuring succulent paneer cubes immersed in a smooth, vibrant spinach curry.",
    image: {
      url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    calories: 360,
    nutrition: { protein: 20, carbs: 12, fat: 26, fiber: 5, sugar: 3 },
    tags: ["palak paneer", "spinach", "vegetarian", "healthy", "indian"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Paneer", quantity: "250", unit: "grams" },
      { name: "Spinach", quantity: "300", unit: "grams" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Tomato", quantity: "1", unit: "pieces" },
      { name: "Garlic", quantity: "6", unit: "cloves" },
      { name: "Ginger", quantity: "10", unit: "grams" },
      { name: "Butter", quantity: "25", unit: "grams" },
      { name: "Garam Masala", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Blanch spinach in boiling water for 2 minutes, then plunge into ice water to preserve its lush green color." },
      { step: 2, description: "Puree blanched spinach with ginger and 2 garlic cloves until smooth." },
      { step: 3, description: "Melt butter in a pan, sauté chopped onions and remaining garlic until lightly golden." },
      { step: 4, description: "Add chopped tomato, garam masala, salt, and cook until oil surfaces." },
      { step: 5, description: "Pour in spinach puree, fold in paneer cubes, and simmer on low for 4 minutes before serving." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
    ],
  },
  {
    title: "Garlic Butter Grilled Cheese Sandwich",
    description:
      "Crisp, golden-crusted sourdough bread loaded with gooey melted cheese and brushed with aromatic garlic herb butter.",
    image: {
      url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Lunch",
    cuisine: "American",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    calories: 420,
    nutrition: { protein: 18, carbs: 32, fat: 25, fiber: 2, sugar: 2 },
    tags: ["sandwich", "cheese", "comfort food", "quick", "lunch"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Bread", quantity: "2", unit: "slices" },
      { name: "Cheese", quantity: "70", unit: "grams" },
      { name: "Butter", quantity: "25", unit: "grams" },
      { name: "Garlic", quantity: "2", unit: "cloves" },
      { name: "Black Pepper", quantity: "1/4", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Mix softened butter with finely grated garlic and a dash of black pepper." },
      { step: 2, description: "Spread garlic butter generously on the outer sides of both bread slices." },
      { step: 3, description: "Place grated or sliced cheese between the unbuttered sides." },
      { step: 4, description: "Grill in a skillet over low-medium heat for 3-4 minutes per side until the bread is golden brown and cheese is completely melted." },
      { step: 5, description: "Slice diagonally and serve immediately while hot and stretchy." },
    ],
    shoppingLinks: [
      { store: "Zepto", url: "https://www.zeptonow.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
    ],
  },
  {
    title: "Kadai Chicken with Bell Peppers",
    description:
      "A rustic, bold North Indian curry featuring tender chicken, crunchy bell peppers, and onions cooked in a spicy kadai masala.",
    image: {
      url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    calories: 490,
    nutrition: { protein: 36, carbs: 14, fat: 28, fiber: 3, sugar: 4 },
    tags: ["chicken", "curry", "spicy", "kadai", "dinner"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Chicken", quantity: "450", unit: "grams" },
      { name: "Capsicum", quantity: "2", unit: "pieces" },
      { name: "Onion", quantity: "2", unit: "pieces" },
      { name: "Tomato", quantity: "3", unit: "pieces" },
      { name: "Garlic", quantity: "5", unit: "cloves" },
      { name: "Ginger", quantity: "15", unit: "grams" },
      { name: "Coriander", quantity: "1", unit: "tbsp" },
      { name: "Chilli Powder", quantity: "1", unit: "tsp" },
      { name: "Butter", quantity: "20", unit: "grams" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Cut capsicum and 1 onion into square petals. Dice the remaining onion finely." },
      { step: 2, description: "Sauté chicken pieces in butter until sealed and golden on all sides." },
      { step: 3, description: "Add ginger, garlic, finely diced onion, and pureed tomatoes. Cook with spices until thick and rich." },
      { step: 4, description: "Toss in bell pepper and onion petals during the last 5 minutes so they remain crisp." },
      { step: 5, description: "Garnish with ginger juliennes and serve with hot tandoori roti." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Blinkit", url: "https://blinkit.com" },
    ],
  },
  {
    title: "Mushroom & Cheese Quesadilla",
    description:
      "Crispy folded tortillas stuffed with sautéed garlic mushrooms, melted sharp cheese, and sweet corn.",
    image: {
      url: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Snack",
    cuisine: "Mexican",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    calories: 380,
    nutrition: { protein: 16, carbs: 36, fat: 20, fiber: 4, sugar: 3 },
    tags: ["mexican", "quesadilla", "cheese", "snack", "quick"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Mushroom", quantity: "200", unit: "grams" },
      { name: "Cheese", quantity: "80", unit: "grams" },
      { name: "Corn", quantity: "50", unit: "grams" },
      { name: "Garlic", quantity: "2", unit: "cloves" },
      { name: "Butter", quantity: "15", unit: "grams" },
      { name: "Black Pepper", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté sliced mushrooms and garlic in 1 tsp butter with corn until caramelized." },
      { step: 2, description: "Place tortilla on a griddle, cover one half with cheese, cooked mushroom filling, and more cheese." },
      { step: 3, description: "Fold in half and toast on medium flame for 3 minutes per side until crunchy and melted." },
      { step: 4, description: "Cut into wedges and serve with salsa or sour cream." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Aloo Gobi (Potato & Cauliflower Roast)",
    description:
      "A comforting, everyday Indian dry curry made with spiced roasted potatoes, cauliflower florets, turmeric, and cumin.",
    image: {
      url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Lunch",
    cuisine: "Indian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    calories: 230,
    nutrition: { protein: 6, carbs: 38, fat: 7, fiber: 6, sugar: 4 },
    tags: ["aloo gobi", "vegan", "gluten-free", "healthy", "lunch"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Potato", quantity: "2", unit: "pieces" },
      { name: "Cauliflower", quantity: "300", unit: "grams" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Tomato", quantity: "1", unit: "pieces" },
      { name: "Cumin", quantity: "1", unit: "tsp" },
      { name: "Turmeric", quantity: "1/2", unit: "tsp" },
      { name: "Chilli Powder", quantity: "1", unit: "tsp" },
      { name: "Garam Masala", quantity: "1/2", unit: "tsp" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Cut potatoes into bite-sized cubes and cauliflower into florets." },
      { step: 2, description: "Heat oil in a pan, add cumin seeds until they splutter, then sauté onions until golden." },
      { step: 3, description: "Add potatoes, cauliflower, turmeric, and salt. Cover and cook on low heat for 12 minutes." },
      { step: 4, description: "Add diced tomato, chilli powder, and garam masala. Fry uncovered on high heat for 3 minutes until lightly roasted." },
      { step: 5, description: "Garnish with fresh coriander and serve with phulkas." },
    ],
    shoppingLinks: [
      { store: "BigBasket", url: "https://www.bigbasket.com" },
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
    ],
  },
  {
    title: "Honey Cinnamon Warm Oatmeal Bowl",
    description:
      "A nutritious, creamy morning bowl of rolled oats simmered in milk, topped with wild honey and a pinch of warming cinnamon.",
    image: {
      url: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Breakfast",
    cuisine: "Continental",
    difficulty: "Easy",
    prepTime: 2,
    cookTime: 6,
    servings: 1,
    calories: 290,
    nutrition: { protein: 11, carbs: 52, fat: 5, fiber: 6, sugar: 14 },
    tags: ["oats", "breakfast", "healthy", "fiber", "sweet"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Oats", quantity: "60", unit: "grams" },
      { name: "Milk", quantity: "200", unit: "ml" },
      { name: "Honey", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "1", unit: "pinch" },
    ],
    instructions: [
      { step: 1, description: "Combine rolled oats, milk, and a tiny pinch of salt in a small saucepan." },
      { step: 2, description: "Bring to a gentle boil over medium heat, stirring occasionally for 4-5 minutes until thick and creamy." },
      { step: 3, description: "Pour into your favorite breakfast bowl." },
      { step: 4, description: "Drizzle with sweet honey and top with your choice of fruits or nuts." },
    ],
    shoppingLinks: [
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Crispy Golden Potato Wedges",
    description:
      "Crispy skin-on baked potato wedges seasoned with garlic, black pepper, and herbs.",
    image: {
      url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Snack",
    cuisine: "Continental",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    calories: 240,
    nutrition: { protein: 4, carbs: 38, fat: 9, fiber: 4, sugar: 1 },
    tags: ["potatoes", "wedges", "finger food", "appetizer", "crispy"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Potato", quantity: "3", unit: "pieces" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Chilli Powder", quantity: "1/2", unit: "tsp" },
      { name: "Black Pepper", quantity: "1/2", unit: "tsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Wash potatoes thoroughly and slice into even wedge shapes." },
      { step: 2, description: "Soak in cold water for 10 minutes, then pat completely dry with a kitchen towel." },
      { step: 3, description: "Toss with olive oil, minced garlic, chilli powder, black pepper, and salt." },
      { step: 4, description: "Bake at 200°C for 25 minutes or pan-roast until crunchy and golden on all sides." },
      { step: 5, description: "Serve hot with garlic mayo or ketchup." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "BigBasket", url: "https://www.bigbasket.com" },
    ],
  },
  {
    title: "Street Style Egg Fried Noodles",
    description:
      "Stir-fried noodles with fluffy scrambled eggs, crisp shredded cabbage, onions, and spicy dark soy sauce.",
    image: {
      url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Asian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    calories: 460,
    nutrition: { protein: 18, carbs: 64, fat: 15, fiber: 4, sugar: 3 },
    tags: ["noodles", "egg", "asian", "street food", "quick dinner"],
    featured: false,
    status: "published",
    ingredientRequirements: [
      { name: "Noodles", quantity: "200", unit: "grams" },
      { name: "Egg", quantity: "2", unit: "pieces" },
      { name: "Cabbage", quantity: "80", unit: "grams" },
      { name: "Onion", quantity: "1", unit: "pieces" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Black Pepper", quantity: "1/2", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Cook noodles al dente, drain and toss with 1 tsp oil to prevent sticking." },
      { step: 2, description: "Scramble eggs in a smoking hot wok with 1 tbsp oil, then remove." },
      { step: 3, description: "Add remaining oil and flash fry minced garlic, sliced onions, and shredded cabbage for 2 minutes." },
      { step: 4, description: "Add cooked noodles, scrambled eggs, soy sauce, and black pepper. Toss on maximum flame for 2 minutes." },
      { step: 5, description: "Serve immediately with chili oil or vinegar." },
    ],
    shoppingLinks: [
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "Zepto", url: "https://www.zeptonow.com" },
    ],
  },
  {
    title: "Tandoori Chicken Tikka",
    description:
      "Juicy, smoky boneless chicken chunks marinated in thick spiced yogurt and roasted to caramelized perfection.",
    image: {
      url: "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=800&auto=format&fit=crop&q=80",
      public_id: "",
    },
    mealType: "Dinner",
    cuisine: "Indian",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 20,
    servings: 3,
    calories: 380,
    nutrition: { protein: 42, carbs: 8, fat: 19, fiber: 2, sugar: 3 },
    tags: ["chicken tikka", "tandoori", "appetizer", "high protein", "low carb"],
    featured: true,
    status: "published",
    ingredientRequirements: [
      { name: "Chicken", quantity: "450", unit: "grams" },
      { name: "Yoghurt", quantity: "120", unit: "grams" },
      { name: "Ginger", quantity: "15", unit: "grams" },
      { name: "Garlic", quantity: "5", unit: "cloves" },
      { name: "Chilli Powder", quantity: "1.5", unit: "tsp" },
      { name: "Garam Masala", quantity: "1", unit: "tsp" },
      { name: "Turmeric", quantity: "1/2", unit: "tsp" },
      { name: "Lemon", quantity: "1", unit: "pieces" },
      { name: "Butter", quantity: "20", unit: "grams" },
      { name: "Salt", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      { step: 1, description: "Cut boneless chicken into 1.5-inch cubes and squeeze fresh lemon juice over it." },
      { step: 2, description: "Mix hung yoghurt with ginger-garlic paste, chilli powder, garam masala, turmeric, and salt." },
      { step: 3, description: "Coat chicken thoroughly in the spiced marinade and refrigerate for 1-2 hours." },
      { step: 4, description: "Thread onto skewers and grill at 220°C or cook in a hot buttered skillet for 15 minutes, turning until charred at edges." },
      { step: 5, description: "Baste with melted butter, sprinkle chaat masala, and serve with onion rings and green chutney." },
    ],
    shoppingLinks: [
      { store: "Swiggy Instamart", url: "https://www.swiggy.com/instamart" },
      { store: "Blinkit", url: "https://blinkit.com" },
      { store: "BigBasket", url: "https://www.bigbasket.com" },
    ],
  },
];

const seedRecipes = async () => {
  try {
    await connectDB();

    console.log("🔍 Fetching existing ingredients to link IDs...");
    const allIngredients = await Ingredient.find();

    if (allIngredients.length === 0) {
      console.log("⚠️ No ingredients found. Please run 'npm run seed' first to seed ingredients.");
      process.exit(1);
    }

    const ingMap = new Map();
    allIngredients.forEach((ing) => {
      ingMap.set(ing.name.toLowerCase().trim(), ing._id);
    });

    console.log(`🧹 Updating & populating ${sampleRecipes.length} rich recipes...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const r of sampleRecipes) {
      const linkedIngredients = [];

      for (const req of r.ingredientRequirements) {
        const foundId = ingMap.get(req.name.toLowerCase().trim());
        if (foundId) {
          linkedIngredients.push({
            ingredient: foundId,
            quantity: req.quantity,
            unit: req.unit,
          });
        }
      }

      const recipeDoc = {
        title: r.title,
        description: r.description,
        image: r.image,
        mealType: r.mealType,
        cuisine: r.cuisine,
        difficulty: r.difficulty,
        prepTime: r.prepTime,
        cookTime: r.cookTime,
        servings: r.servings,
        calories: r.calories,
        nutrition: r.nutrition,
        tags: r.tags,
        featured: r.featured,
        status: r.status,
        instructions: r.instructions,
        shoppingLinks: r.shoppingLinks,
        ingredients: linkedIngredients,
      };

      // Check if recipe exists by slug or key title words
      const existing = await Recipe.findOne({
        $or: [
          { title: r.title },
          { title: { $regex: new RegExp(r.title.split(" ").slice(0, 2).join(" "), "i") } }
        ]
      });

      if (existing) {
        console.log(`🔄 Updating existing recipe: ${existing.title}`);
        Object.assign(existing, recipeDoc);
        await existing.save();
        updatedCount++;
      } else {
        console.log(`✨ Creating new recipe: ${r.title}`);
        await Recipe.create(recipeDoc);
        createdCount++;
      }
    }

    console.log(`✅ ${createdCount} new recipes created, ${updatedCount} recipes updated! Total 20 sample recipes ready.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Recipe seeding failed:", error.message);
    process.exit(1);
  }
};

seedRecipes();
