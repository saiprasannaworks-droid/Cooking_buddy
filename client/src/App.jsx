/**
 * App.jsx
 * ----------------------------------------
 * Central routing configuration for Cooking Buddy frontend.
 */

import { Route, Routes } from "react-router-dom";

// Layout wrapper
import MainLayout from "./components/layout/MainLayout.jsx";

// Core pages
import HomePage from "./pages/HomePage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Auth & Route protection
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Recipes
import RecipesPage from "./pages/RecipesPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import RecipeFormPage from "./pages/RecipeFormPage.jsx";

// User & Pantry features
import FavoritesPage from "./pages/FavoritesPage.jsx";
import MatchPage from "./pages/MatchPage.jsx";

// Admin features
import AdminPage from "./pages/AdminPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Recipes Discovery & Single View */}
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        
        {/* Recipe Create & Edit (Available to all registered chefs) */}
        <Route
          path="recipes/new"
          element={
            <ProtectedRoute>
              <RecipeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recipes/:id/edit"
          element={
            <ProtectedRoute>
              <RecipeFormPage edit />
            </ProtectedRoute>
          }
        />

        {/* Favorites (Protected) */}
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        {/* Ingredient Match ("Cook with what you have") */}
        <Route path="match" element={<MatchPage />} />

        {/* Admin Dashboard (Admin only) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <PlaceholderPage
              eyebrow="Page not found"
              title="This recipe path is not on the menu."
              description="Use the navigation to return to Cooking Buddy home."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
