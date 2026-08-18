import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BookOpen,
  Users,
  Heart,
  Upload,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  Flame,
} from "lucide-react";
import api from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";

function AdminPage() {
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    recipes: 0,
    users: 0,
    ingredients: 0,
    favorites: 0,
    shoppingClicks: 0,
  });
  const [storeBreakdown, setStoreBreakdown] = useState([]);
  const [topClickedRecipes, setTopClickedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState("recipes"); // "recipes" | "upload" | "analytics" | "users"
  const [loading, setLoading] = useState(true);

  // Bulk upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, recipesRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/recipes"),
        api.get("/admin/users"),
      ]);

      setStats(
        statsRes.data.stats || {
          recipes: 0,
          users: 0,
          ingredients: 0,
          favorites: 0,
          shoppingClicks: 0,
        }
      );
      setStoreBreakdown(statsRes.data.storeBreakdown || []);
      setTopClickedRecipes(statsRes.data.topClickedRecipes || []);
      setRecipes(recipesRes.data.recipes || []);
      setUsersList(usersRes.data.users || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
      addToast(err.response?.data?.message || "Failed to fetch admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteRecipe = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/recipes/${id}`);
      addToast(`Recipe "${title}" deleted successfully`, "success");
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      setStats((prev) => ({ ...prev, recipes: Math.max(0, prev.recipes - 1) }));
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete recipe", "error");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      addToast(`User role updated to ${newRole}`, "success");
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      addToast(`User "${name}" deleted`, "success");
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
      setStats((prev) => ({ ...prev, users: Math.max(0, prev.users - 1) }));
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      addToast("Please select a CSV or Excel file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await api.post("/ingredients/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadResult({
        success: true,
        message: res.data.message || "Ingredients uploaded successfully!",
        count: res.data.totalUploaded,
      });
      addToast("Ingredients uploaded successfully!", "success");
      setUploadFile(null);
      // Refresh stats
      fetchAdminData();
    } catch (err) {
      setUploadResult({
        success: false,
        message: err.response?.data?.message || "Upload failed",
      });
      addToast(err.response?.data?.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "name,category,unit,calories,protein,carbs,fat,isAllergen,allergenType\n" +
      "Olive Oil,Pantry & Spices,tbsp,119,0,0,14,false,\n" +
      "Garlic,Vegetables,cloves,4,0.2,1,0,false,\n" +
      "Chicken Breast,Proteins,grams,165,31,0,3.6,false,\n" +
      "Parmesan Cheese,Dairy,grams,110,10,0.9,7.3,true,Dairy\n" +
      "Spaghetti Pasta,Grains & Bakery,grams,220,8,43,1.3,true,Gluten\n" +
      "Fresh Basil,Vegetables,leaves,1,0.1,0.1,0,false,\n" +
      "Eggs,Proteins,pieces,78,6,0.6,5,true,Eggs\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cooking_buddy_sample_ingredients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="section admin-page">
      <div className="container">
        {/* Page Header */}
        <div className="admin-header">
          <div className="admin-header__title-wrap">
            <p className="eyebrow">
              <Shield size={15} /> Administration Hub
            </p>
            <h1>Control Panel</h1>
            <p className="admin-subtitle">
              Manage recipes, track grocery affiliate clicks, bulk upload pantry ingredients, and review metrics.
            </p>
          </div>

          <Link to="/recipes/new" className="button button--primary create-recipe-top-btn">
            <Plus size={16} /> Add New Recipe
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-card__icon icon-pine">
              <BookOpen size={22} />
            </div>
            <div className="admin-stat-card__info">
              <h3>{loading ? "..." : stats.recipes}</h3>
              <p>Total Recipes</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-card__icon icon-coral">
              <ShoppingBag size={22} />
            </div>
            <div className="admin-stat-card__info">
              <h3>{loading ? "..." : stats.shoppingClicks || 0}</h3>
              <p>Grocery Outbound Clicks</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-card__icon icon-peach">
              <Users size={22} />
            </div>
            <div className="admin-stat-card__info">
              <h3>{loading ? "..." : stats.users}</h3>
              <p>Registered Users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-card__icon icon-moss">
              <Heart size={22} />
            </div>
            <div className="admin-stat-card__info">
              <h3>{loading ? "..." : stats.favorites}</h3>
              <p>Saved Favorites</p>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === "recipes" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("recipes")}
          >
            <BookOpen size={16} /> Recipe Catalog ({recipes.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "analytics" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <TrendingUp size={16} /> Affiliate & Grocery Clicks ({stats.shoppingClicks || 0})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "upload" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload size={16} /> Bulk Ingredient Upload
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "users" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={16} /> User Directory ({usersList.length})
          </button>
        </div>

        {/* Tab 1: Recipe Management */}
        {activeTab === "recipes" && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h2>Manage Recipes</h2>
                <p>View, update, or remove recipes in the public directory.</p>
              </div>
              <Link to="/recipes/new" className="button button--secondary">
                <Plus size={15} /> Create Recipe
              </Link>
            </div>

            {recipes.length === 0 ? (
              <div className="empty-table-state">
                <p>No recipes added yet.</p>
                <Link to="/recipes/new" className="button button--primary">
                  Create First Recipe
                </Link>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Recipe</th>
                      <th>Cuisine</th>
                      <th>Meal</th>
                      <th>Difficulty</th>
                      <th>Grocery Clicks</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <div className="table-recipe-cell">
                            {r.image?.url ? (
                              <img
                                src={r.image.url}
                                alt={r.title}
                                className="table-thumb"
                              />
                            ) : (
                              <div className="table-thumb table-thumb--placeholder">
                                🍲
                              </div>
                            )}
                            <div>
                              <strong>{r.title}</strong>
                              <small>{r.servings || 1} servings</small>
                            </div>
                          </div>
                        </td>
                        <td>{r.cuisine || "—"}</td>
                        <td>{r.mealType || "—"}</td>
                        <td>
                          <span className={`badge badge--${r.difficulty?.toLowerCase() || "easy"}`}>
                            {r.difficulty || "Easy"}
                          </span>
                        </td>
                        <td>
                          <span className="detail-item font-semibold">
                            🛒 {r.clickCount || 0}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              to={`/recipes/${r._id}`}
                              className="action-btn action-btn--view"
                              title="View Recipe"
                            >
                              <ExternalLink size={15} />
                            </Link>
                            <Link
                              to={`/recipes/${r._id}/edit`}
                              className="action-btn action-btn--edit"
                              title="Edit Recipe"
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              type="button"
                              className="action-btn action-btn--delete"
                              title="Delete Recipe"
                              onClick={() => handleDeleteRecipe(r._id, r.title)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Affiliate & Grocery Tracking Analytics */}
        {activeTab === "analytics" && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h2>Grocery Affiliate & Shopping Outbound Analytics</h2>
                <p>Track user conversion clicks to quick commerce & delivery platforms for monetization.</p>
              </div>
            </div>

            <div className="analytics-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "16px" }}>
              {/* Store Breakdown */}
              <div className="sidebar-card">
                <h3>🛒 Clicks by Grocery Platform</h3>
                {storeBreakdown.length === 0 ? (
                  <p className="shopping-note">No store clicks recorded yet. Clicks will populate when users order ingredients on Swiggy Instamart, Blinkit, Zepto, or BigBasket.</p>
                ) : (
                  <div className="store-clicks-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {storeBreakdown.map((s, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", background: "var(--cream)", border: "1px solid var(--line)" }}>
                        <strong>{s.storeName}</strong>
                        <span className="badge badge--meal">{s.count} clicks</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Clicked Recipes */}
              <div className="sidebar-card">
                <h3>🔥 Top Converting Recipes</h3>
                {topClickedRecipes.length === 0 ? (
                  <p className="shopping-note">Recipes with the highest ingredient order intent will appear here.</p>
                ) : (
                  <div className="store-clicks-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {topClickedRecipes.map((r, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", background: "var(--cream)", border: "1px solid var(--line)" }}>
                        <div>
                          <strong>{r.title}</strong>
                          <div style={{ fontSize: "0.76rem", color: "var(--ink-soft)" }}>{r.cuisine} · {r.mealType}</div>
                        </div>
                        <span className="badge badge--easy">{r.clickCount} orders</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bulk Ingredient Upload */}
        {activeTab === "upload" && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h2>Bulk Ingredient Ingestion</h2>
                <p>
                  Quickly populate hundreds of kitchen ingredients via CSV or Excel (.xlsx) spreadsheet.
                </p>
              </div>
              <button
                type="button"
                className="button button--secondary"
                onClick={downloadSampleCsv}
              >
                <Download size={15} /> Download Sample CSV
              </button>
            </div>

            <form onSubmit={handleBulkUpload} className="bulk-upload-form">
              <div className="upload-dropzone">
                <FileSpreadsheet size={40} className="dropzone-icon" />
                <h3>Select CSV or Excel Spreadsheet</h3>
                <p>Columns: name, category, unit, calories, protein, carbs, fat</p>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="file-input-hidden"
                  id="ingredient-file-input"
                />
                <label
                  htmlFor="ingredient-file-input"
                  className="button button--secondary"
                >
                  {uploadFile ? `Selected: ${uploadFile.name}` : "Browse File on Device"}
                </label>
              </div>

              {uploadResult && (
                <div
                  className={`upload-feedback-banner ${
                    uploadResult.success
                      ? "upload-feedback-banner--success"
                      : "upload-feedback-banner--error"
                  }`}
                >
                  {uploadResult.success ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span>{uploadResult.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="button button--primary submit-upload-btn"
                disabled={!uploadFile || uploading}
              >
                <Upload size={16} />
                <span>{uploading ? "Processing Ingredients..." : "Upload Ingredients to Database"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: User Directory */}
        {activeTab === "users" && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h2>User Directory</h2>
                <p>Manage user permissions and account roles.</p>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th className="text-right">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn action-btn--delete"
                            title="Delete User"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;
