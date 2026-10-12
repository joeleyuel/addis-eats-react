import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchDishes } from "../api/dishes.js";
import { useFetch } from "../hooks/useFetch.js";
import { useDebounce } from "../hooks/useDebounce.js";
import CategoryBar, { CATEGORIES } from "./CategoryBar.jsx";
import DishCard from "./DishCard.jsx";
import Spinner from "../ui/Spinner.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Button from "../ui/Button.jsx";
import "./Menu.css";

export default function Menu() {
  const { data: dishes, loading, error, reload } = useFetch(fetchDishes, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  // Feature 3 — Category Filter reflected in the URL (?category=Pizza)
  // An unknown or mistyped ?category= value falls back to "All" instead of an empty page.
  const requested = (searchParams.get("category") || "").toLowerCase();
  const activeCategory = CATEGORIES.find((c) => c.toLowerCase() === requested) || "All";

  function setCategory(category) {
    const next = new URLSearchParams(searchParams);
    if (category === "All") {
      next.delete("category");
    } else {
      next.set("category", category);
    }
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchInput("");
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  }

  // Feature 2 — Live Search, debounced
  const debouncedSearch = useDebounce(searchInput, 200);

  const filteredDishes = useMemo(() => {
    if (!dishes) return [];
    return dishes.filter((dish) => {
      const matchesCategory = activeCategory === "All" || dish.category === activeCategory;
      const query = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        dish.name.toLowerCase().includes(query) ||
        dish.shortDescription.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [dishes, activeCategory, debouncedSearch]);

  return (
    <div className="container section">
      <p className="eyebrow">Addis Ababa Kitchens</p>
      <h1>Explore Menu</h1>
      <p className="menu-lead">
        Explore authentic Ethiopian dishes, fresh wood-fired pizza, artisan burgers, and Addis signature
        beverages crafted across local favorites.
      </p>

      <div className="menu-controls">
        <label className="menu-search">
          <span className="visually-hidden">Search dishes, ingredients, or restaurants</span>
          <input
            type="search"
            placeholder="Search dishes, ingredients…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <CategoryBar active={activeCategory} onSelect={setCategory} />
      </div>

      {loading && <Spinner label="Loading the menu…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && filteredDishes.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No dishes match your search"
          message="Try a different keyword or clear the category filter."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      {!loading && !error && filteredDishes.length > 0 && (
        <div className="grid-cards menu-grid">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
