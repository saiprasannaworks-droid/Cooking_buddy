/**
 * MainLayout.jsx
 * ----------------------------------------
 * Global layout wrapper for Cooking Buddy.
 */

import { Heart, Menu, Sparkles, X, Shield, PlusCircle, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Logo from "../ui/Logo.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const navItems = [
  { label: "Discover", to: "/recipes" },
  { label: "Ingredient Match", to: "/match" },
  { label: "Favorites", to: "/favorites" },
];

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const { user, favorites, logout } = useContext(AuthContext);
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    closeMenu();
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <div className="app-shell">
      {/* Sticky Header */}
      <header className="site-header">
        <div className="site-header__inner container">
          <Logo />

          {/* Desktop & Mobile Nav */}
          <nav
            className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link--active" : ""}`
                }
              >
                <span>{item.label}</span>
                {item.to === "/favorites" && user && favorites.length > 0 && (
                  <span className="nav-badge">{favorites.length}</span>
                )}
              </NavLink>
            ))}

            {/* Admin link if admin role */}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `nav-link nav-link--admin ${isActive ? "nav-link--active" : ""}`
                }
              >
                <Shield size={16} aria-hidden="true" />
                <span>Admin Hub</span>
              </NavLink>
            )}

            {/* Mobile Auth Actions */}
            <div className="mobile-auth-section">
              {user ? (
                <>
                  <div className="mobile-user-greeting">
                    <span>Signed in as <strong>{user.name}</strong></span>
                    {isAdmin && <span className="admin-pill">Admin</span>}
                  </div>
                  <Link
                    to="/recipes/new"
                    className="button button--secondary button--sm mobile-new-recipe"
                    onClick={closeMenu}
                  >
                    <PlusCircle size={15} /> Add Recipe
                  </Link>
                  <button
                    type="button"
                    className="button button--ghost mobile-logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link
                    to="/login"
                    className="button button--secondary"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="button button--primary"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Header Actions */}
          <div className="header-actions">
            {user ? (
              <div className="user-profile-menu">
                <Link
                  to="/recipes/new"
                  className="button button--secondary button--sm create-recipe-btn"
                >
                  <PlusCircle size={15} /> Add Recipe
                </Link>
                <div className="user-pill">
                  <span className="user-name">Hello, {user.name?.split(" ")[0]}</span>
                  {isAdmin && <span className="admin-badge-mini">Admin</span>}
                </div>
                <button
                  type="button"
                  className="button button--ghost logout-btn"
                  onClick={handleLogout}
                  title="Sign out of account"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Button to="/login" variant="ghost">
                  Log In
                </Button>
                <Button to="/register" variant="primary" icon>
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="footer-brand">
            <Logo />
            <p>Thoughtful recipes and intelligent pantry matching for every home kitchen.</p>
          </div>

          <div className="footer-nav">
            <Link to="/recipes">Explore Recipes</Link>
            <Link to="/match">Pantry Match</Link>
            <Link to="/favorites">Saved Dishes</Link>
            {isAdmin && <Link to="/admin">Admin Hub</Link>}
          </div>

          <div className="footer-note">
            <Sparkles size={15} aria-hidden="true" />
            <span>Crafted with love for home cooks everywhere.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
