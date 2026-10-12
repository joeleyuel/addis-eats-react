import { Link } from "react-router-dom";
import { fetchDishes } from "../api/dishes.js";
import { useFetch } from "../hooks/useFetch.js";
import { useFavorites } from "./favoritesStore.jsx";
import DishCard from "../menu/DishCard.jsx";
import Spinner from "../ui/Spinner.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Button from "../ui/Button.jsx";

export default function Favorites() {
  const { data: dishes, loading, error, reload } = useFetch(fetchDishes, []);
  const { favoriteIds } = useFavorites();

  const favoriteDishes = dishes ? dishes.filter((dish) => favoriteIds.includes(dish.id)) : [];

  return (
    <div className="container section">
      <p className="eyebrow">Personal collection</p>
      <h1>My Favorites</h1>
      <p className="menu-lead">
        Quick access to your most-craved Ethiopian meals and drinks. Freshly prepared and ready to reorder
        in one tap.
      </p>

      {loading && <Spinner label="Loading your favorites…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && favoriteDishes.length === 0 && (
        <EmptyState
          icon="♡"
          title="No favorites yet"
          message="Tap the heart on any dish to save it here for quick reordering."
          action={
            <Button as={Link} to="/menu" variant="primary">
              Browse the menu
            </Button>
          }
        />
      )}

      {!loading && !error && favoriteDishes.length > 0 && (
        <div className="grid-cards">
          {favoriteDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
