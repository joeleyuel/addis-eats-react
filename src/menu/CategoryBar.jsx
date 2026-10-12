import "./CategoryBar.css";

export const CATEGORIES = ["All", "Ethiopian", "Pizza", "Burgers", "Drinks"];

// Feature 3 — Category Filter, reflected in the URL by the parent (Menu.jsx)
export default function CategoryBar({ active, onSelect }) {
  return (
    <div className="category-bar" role="group" aria-label="Filter by category">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={active === category}
          className={`category-pill${active === category ? " category-pill--active" : ""}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
