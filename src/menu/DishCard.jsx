import { Link } from "react-router-dom";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import Button from "../ui/Button.jsx";
import FoodImage from "../ui/FoodImage.jsx";
import { useCart } from "../cart/cartStore.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import "./DishCard.css";

export default function DishCard({ dish }) {
  const { addItem } = useCart();

  return (
    <article className="dish-card">
      <Link to={`/menu/${dish.id}`} className="dish-card__media">
        <FoodImage src={dish.image} alt={dish.name} loading="lazy" />
        <span className="dish-card__category">{dish.category}</span>
        <div className="dish-card__favorite">
          <FavoriteButton dishId={dish.id} dishName={dish.name} />
        </div>
      </Link>
      <div className="dish-card__body">
        <Link to={`/menu/${dish.id}`} className="dish-card__title-link">
          <h3>{dish.name}</h3>
        </Link>
        <p className="dish-card__desc">{dish.shortDescription}</p>
        <div className="dish-card__meta">
          <span className="dish-card__rating">★ {dish.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{dish.prepTime}</span>
        </div>
        <div className="dish-card__footer">
          <span className="dish-card__price">{formatETB(dish.price)}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => addItem(dish, 1)}
            aria-label={`Add ${dish.name} to cart`}
          >
            + Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
