import Button from "../components/ui/Button.jsx";

function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <section className="placeholder-page section">
      <div className="container placeholder-page__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Button to="/" variant="secondary">Back home</Button>
      </div>
    </section>
  );
}

export default PlaceholderPage;
