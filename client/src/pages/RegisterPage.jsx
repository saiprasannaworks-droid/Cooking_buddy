import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Lock, Mail, User, ChefHat } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      addToast("Welcome to Cooking Buddy! Your account is ready.", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
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
            <p className="eyebrow">Join Cooking Buddy</p>
            <h1 className="auth-title">Create your chef profile</h1>
            <p className="auth-subtitle">
              Personalize your cooking experience, discover tailored meals, and curate your favorites.
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="field-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={17} className="input-icon" />
                <input
                  type="text"
                  placeholder="Julia Child"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
            </div>

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
              <label className="field-label">Password (min 6 characters)</label>
              <div className="input-icon-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
              <span>{loading ? "Creating account..." : "Join Cooking Buddy"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-card__footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
