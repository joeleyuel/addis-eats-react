import { useFavorites } from "./favoritesStore.jsx";
import "./FavoriteButton.css";

export default function FavoriteButton({ dishId, dishName }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(dishId);

  return (
    <button
      type="button"
      className={`favorite-btn${active ? " favorite-btn--active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(dishId);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${dishName} from favorites` : `Add ${dishName} to favorites`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
