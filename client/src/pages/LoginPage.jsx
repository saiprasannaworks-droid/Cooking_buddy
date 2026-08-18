import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Lock, Mail, ChefHat } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      addToast("Welcome back to Cooking Buddy!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section auth-section">
      <div className="container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="brand-mark-auth">
              <ChefHat size={24} />
            </div>
            <p className="eyebrow">Welcome Back</p>
            <h1 className="auth-title">Sign in to your kitchen</h1>
            <p className="auth-subtitle">
              Access your personalized recipe recommendations, pantry match history, and saved dishes.
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="field-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  placeholder="chef@cookingbuddy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="button button--primary auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign In to Cooking Buddy"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-card__footer">
            <p>
              Don't have an account yet?{" "}
              <Link to="/register" className="auth-switch-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
