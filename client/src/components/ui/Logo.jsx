import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link className="brand" to="/" aria-label="Cooking Buddy home">
      <span className="brand-mark">
        <ChefHat aria-hidden="true" size={21} strokeWidth={2.3} />
      </span>
      <span>cooking<span>buddy</span></span>
    </Link>
  );
}

export default Logo;
