import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  icon = false,
  className = "",
  ...props
}) {
  const content = (
    <>
      <span>{children}</span>
      {icon && <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />}
    </>
  );

  const classes = `button button--${variant} ${className}`.trim();

  if (to) {
    return <Link className={classes} to={to} {...props}>{content}</Link>;
  }

  return <button className={classes} type={type} {...props}>{content}</button>;
}

export default Button;
