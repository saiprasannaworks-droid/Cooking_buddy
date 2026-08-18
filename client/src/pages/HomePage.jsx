import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import RecipeCard from "../components/recipe/RecipeCard.jsx";
import {
  ArrowUpRight,
  Clock3,
  Heart,
  Search,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";

const features = [
  {
    icon: <Search size={20} />,
    title: "Discover with ease",
    text: "Find dishes that match your mood, time, and taste with multi-criteria filters.",
  },
  {
    icon: <UtensilsCrossed size={20} />,
    title: "Cook what you have",
    text: "Turn everyday ingredients into satisfying meals with zero kitchen waste.",
  },
  {
    icon: <Heart size={20} />,
    title: "Keep your favourites",
    text: "Build a personalized collection of recipes you will want to cook again.",
  },
];

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await api.get("/recipes");
        setRecipes(response.data.recipes || response.data || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    getRecipes();
  }, []);

  const displayRecipes = recipes.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="hero section">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="eyebrow">
              <Sparkles size={15} aria-hidden="true" /> Make everyday cooking feel special
            </div>
            <h1>
              Your kitchen,
              <br />
              <em>your kind</em> of delicious.
            </h1>
            <p className="hero__lead">
              Discover comforting recipes, make the most of what is already in your pantry,
              and save every dish worth repeating.
            </p>
            <div className="hero__buttons">
              <Button to="/recipes" icon>
                Explore recipes
              </Button>
              <Button to="/match" variant="secondary">
                Match my ingredients
              </Button>
            </div>
            <div className="hero__social-proof">
              <div className="avatar-group" aria-hidden="true">
                <span>R</span>
                <span>M</span>
                <span>A</span>
                <span>J</span>
              </div>
              <p>
                <strong>Simple, considered cooking</strong>
                <br />
                made for every kind of home kitchen.
              </p>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="Illustration of a home-cooked meal"
          >
            <div className="hero-visual__arch" />
            <div className="plate plate--back" />
            <div className="plate plate--front">
              <span className="food food--one" />
              <span className="food food--two" />
              <span className="food food--three" />
              <span className="food food--four" />
              <span className="food food--five" />
            </div>
            <div className="floating-card floating-card--time">
              <Clock3 size={17} />
              <span>
                <strong>30 min</strong>
                <small>ready to serve</small>
              </span>
            </div>
            <div className="floating-card floating-card--save">
              <Heart size={17} fill="currentColor" />
              <span>
                <strong>Made for you</strong>
                <small>save recipes you love</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Recipes Showcase */}
      <section className="section section--recipes">
        <div className="container">
          <div className="section-heading-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
            <div className="section-heading">
              <p className="eyebrow">Fresh from Cooking Buddy</p>
              <h2>Recipes worth making tonight.</h2>
            </div>
            <Link to="/recipes" className="button button--secondary">
              <span>View all recipes</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="recipe-skeleton" />
              ))}
            </div>
          ) : displayRecipes.length === 0 ? (
            <div className="empty-state-card">
              <p>No recipes available yet. Be the first to add one in the admin panel!</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {displayRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section section--features">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Cooking made more thoughtful</p>
            <h2>
              Everything you need
              <br />
              for a better dinner decision.
            </h2>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-card__number">0{index + 1}</span>
                <span className="feature-card__icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Card Section */}
      <section className="section section--cta">
        <div className="container cta-card">
          <div>
            <p className="eyebrow eyebrow--light">
              Start with what you already have
            </p>
            <h2>
              Your next great meal
              <br />
              could be in your kitchen.
            </h2>
          </div>
          <Button to="/match" variant="light" icon>
            Find a recipe
          </Button>
          <ArrowUpRight
            className="cta-card__arrow"
            size={86}
            aria-hidden="true"
          />
        </div>
      </section>
    </>
  );
}

export default HomePage;
