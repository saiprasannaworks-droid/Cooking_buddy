# 🍳 Cooking Buddy — Smart Pantry & Recipe Discovery Platform

> **A full-stack MERN web application for home cooks: discover recipes, cook with what's in your pantry, and order ingredients with 1-click quick commerce.**

---

## 🌟 Overview

**Cooking Buddy** is a modern full-stack culinary application designed to eliminate food waste and simplify meal planning. Home cooks can enter the ingredients already present in their fridge or pantry to find matching recipes ranked by completeness, follow interactive step-by-step cooking checklists, bookmark favorite dishes, and order missing grocery items via integrated delivery partners (Swiggy Instamart, Blinkit, Zepto, BigBasket, and Amazon Fresh).

---

## ✨ Key Features

### 1. 🥑 Smart Zero-Waste Pantry Matcher ("Cook with What You Have")
- Interactive kitchen pantry selector organized by categories: *Vegetables, Proteins, Dairy, Pantry & Spices, Grains & Bakery, and Fruits*.
- Instant ingredient search and tag selection.
- Algorithmic recipe ranking with **Match Percentage Badges** (e.g. `100% Match`, `85% Match`) and missing ingredient breakdown.
- Threshold filter to display only full or high-percentage matches.

### 2. 🔍 Curated Recipe Catalog & Multi-Criteria Filtering
- Live search across recipe titles, ingredients, and cuisines.
- Multi-pill filter controls:
  - **Meal Type**: *Breakfast, Lunch, Dinner, Snack, Dessert*
  - **Difficulty**: *Easy, Medium, Hard*
  - **Cuisine**: *Indian, Italian, Asian, American, Mexican, Continental, etc.*
- Sort options by *Quickest Cook Time, Lowest Calories, Most Servings, and Newest*.

### 3. 📖 Editorial Recipe View & Interactive Cooking Mode
- High-resolution recipe imagery with metadata pills (Prep Time, Cook Time, Servings, Calories).
- **Interactive Ingredient Checklist**: Home cooks can check off ingredients as they prep.
- **Numbered Cooking Steps**: Interactive step tracker with "mark as completed" progress indicators.
- **Nutrition Breakdown Card**: Protein, Carbs, Fat, and Dietary Fiber per serving.
- **One-Click Share & Print**: Generates clean printable cards and clipboard links.

### 4. 🛒 Grocery Quick-Commerce & Affiliate Outbound Tracking
- Integrated 1-click delivery partner links for ingredients (*Swiggy Instamart, Blinkit, Zepto, BigBasket, Amazon Fresh*).
- Built-in click tracking backend for affiliate analytics and consumer survey insights.

### 5. ❤️ Personal Cookbook & Favorites
- Fast 1-click bookmarking on recipe cards and detail pages.
- Real-time optimistic UI synchronization.
- Filterable collection page for saved recipes.

### 6. ✍️ Recipe Studio (Create & Edit Recipes)
- Multi-section recipe submission studio for registered cooks.
- Cloudinary-powered drag-and-drop recipe image uploader.
- Dynamic ingredient row builder and step-by-step instruction editor.
- Automatic slug generation and search indexing.

### 7. 🛡️ Comprehensive Admin Control Hub
- **Live Metrics Overview**: Real-time counts for recipes, registered users, pantry ingredients, and saved favorites.
- **Monetization & Affiliate Analytics**: Dedicated dashboard tracking outbound grocery clicks by store platform and identifying top converting recipes.
- **Recipe Management**: Table view with thumbnail previews, quick edit, and deletion.
- **Bulk Ingredient Ingestion**: Ingest hundreds of ingredients at once via CSV or Excel (`.xlsx`) spreadsheets with downloadable sample templates.
- **User Role Management**: Manage user directory and grant administrator permissions.

---

## 🛠️ Technology Stack

### **Frontend**
- **Library**: React 19
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla Modern CSS Design System (Custom HSL Tokens, DM Sans & Fraunces Serif Typography)
- **Icons**: Lucide React
- **HTTP Client**: Axios (with centralized JWT request & error interceptors)
- **Build Tool**: Vite

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with BcryptJS password hashing
- **File Uploads**: Multer & Cloudinary SDK
- **Spreadsheet Parsing**: `xlsx` & `csv-parser`
- **Security**: Rate limiting, CORS, HTTP security headers

---

## 📂 Project Architecture

```text
Cooking_Buddy/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # MainLayout, Header, Footer
│   │   │   ├── recipe/         # RecipeCard
│   │   │   └── ui/             # Buttons, Logos, Toasts
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # HomePage, RecipesPage, MatchPage, AdminPage, etc.
│   │   ├── services/           # Axios API instance with interceptors
│   │   ├── index.css           # Global design system & component styles
│   │   └── App.jsx             # Route definitions & guards
│   ├── .env.example            # Sample frontend environment config
│   └── package.json
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB, Cloudinary, Env loaders
│   │   ├── controllers/        # Auth, Recipe, Ingredient, Admin, Favorite controllers
│   │   ├── middleware/         # Auth, Admin, Image Upload, Error handlers
│   │   ├── models/             # Mongoose schemas (Recipe, User, Ingredient, ShoppingClick)
│   │   ├── routes/             # REST endpoint routers
│   │   ├── seed/               # Database seed scripts & sample dataset
│   │   ├── app.js              # Express app initialization
│   │   └── server.js           # Server entry point
│   ├── .env.example            # Sample backend environment config
│   └── package.json
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🔌 API Endpoints Reference

### **Authentication (`/api/auth`)**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user & return JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private |

### **Recipes (`/api/recipes`)**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/recipes` | List all published recipes | Public |
| `GET` | `/api/recipes/:id` | Get single recipe by ID | Public |
| `POST` | `/api/recipes/match` | Match recipes by ingredient IDs | Public |
| `POST` | `/api/recipes/:id/shopping-click` | Track outbound grocery clicks | Public |
| `POST` | `/api/recipes` | Create a new recipe (with image upload) | Private |
| `PUT` | `/api/recipes/:id` | Update recipe (Creator or Admin) | Private |
| `DELETE`| `/api/recipes/:id` | Delete recipe (Creator or Admin) | Private |

### **Ingredients (`/api/ingredients`)**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/ingredients` | Get list of all pantry ingredients | Public |
| `POST` | `/api/ingredients` | Create single ingredient | Admin |
| `POST` | `/api/ingredients/bulk-upload` | Bulk upload CSV / Excel spreadsheet | Admin |

### **Favorites (`/api/favorites`)**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/favorites` | Get user's saved recipes | Private |
| `POST` | `/api/favorites/:recipeId` | Add recipe to favorites | Private |
| `DELETE`| `/api/favorites/:recipeId` | Remove recipe from favorites | Private |

### **Admin & Analytics (`/api/admin`)**
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard counts, store click analytics & recent items | Admin |
| `GET` | `/api/admin/users` | List all registered users | Admin |
| `PUT` | `/api/admin/users/:id/role` | Update user role (`user` / `admin`) | Admin |
| `DELETE`| `/api/admin/users/:id` | Delete a user account | Admin |

---

## 🚀 Getting Started Locally

### **1. Prerequisites**
- **Node.js** (v18 or higher)
- **MongoDB** (Atlas connection URI or local MongoDB instance)
- **Cloudinary Account** (for recipe image hosting)

---

### **2. Clone & Setup Environment Files**

```bash
# Clone the repository
git clone https://github.com/your-username/cooking-buddy.git
cd cooking-buddy
```

#### **Backend Environment Setup:**
Navigate to `server/` and create `.env` using `.env.example`:
```bash
cd server
cp .env.example .env
```
Fill in your configuration in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### **Frontend Environment Setup:**
Navigate to `client/` and create `.env` using `.env.example`:
```bash
cd ../client
cp .env.example .env
```
```env
VITE_API_URL=http://localhost:5000/api
```

---

### **3. Install Dependencies & Seed Database**

```bash
# Install Server Dependencies
cd ../server
npm install

# Seed Pantry Ingredients (40+ items) and 20 Full Sample Recipes
npm run seed
npm run seed:recipes

# Install Client Dependencies
cd ../client
npm install
```

---

### **4. Run the Development Servers**

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Client running at http://localhost:5173
```

---

## 🚢 Production Deployment

### **Deploying Backend (Render / Railway)**
1. Connect your GitHub repository to **Render** or **Railway**.
2. Set Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add the environment variables from `server/.env.example` in your hosting dashboard.

### **Deploying Frontend (Vercel / Netlify)**
1. Connect your repository to **Vercel** or **Netlify**.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set `VITE_API_URL` environment variable pointing to your deployed backend (e.g. `https://your-api.onrender.com/api`).

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
