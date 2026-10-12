import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DISH_NOT_FOUND_MESSAGE, fetchDishById } from "../api/dishes.js";
import { useFetch } from "../hooks/useFetch.js";
import { useCart } from "../cart/cartStore.jsx";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import Button from "../ui/Button.jsx";
import FoodImage from "../ui/FoodImage.jsx";
import Spinner from "../ui/Spinner.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import "./DishDetail.css";

export default function DishDetail() {
  const { id } = useParams();
  const { data: dish, loading, error, reload } = useFetch((signal) => fetchDishById(id, signal), [id]);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef(null);

  // Don't leave a timer running after the customer leaves the page.
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  if (loading) {
    return (
      <div className="container section">
        <Spinner label="Loading dish…" />
      </div>
    );
  }

  if (error || !dish) {
    const notFound = error === DISH_NOT_FOUND_MESSAGE;
    return (
      <div className="container section">
        <ErrorState
          title={notFound ? "Dish not found" : "Something went wrong"}
          message={error}
          onRetry={notFound ? undefined : reload}
          action={
            <Button as={Link} to="/menu" variant={notFound ? "primary" : "secondary"}>
              Back to the menu
            </Button>
          }
        />
      </div>
    );
  }

  function handleAddToCart() {
    addItem(dish, quantity);
    setJustAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="container section dish-detail">
      <Link to="/menu" className="dish-detail__back">
        ← Back to Menu
      </Link>

      <div className="dish-detail__grid">
        <div className="dish-detail__media">
          <FoodImage src={dish.image} alt={dish.name} />
        </div>

        <div className="dish-detail__info">
          <p className="dish-detail__category">
            {dish.category.toUpperCase()} · {dish.spicy ? "Spiced" : "Mild"}
          </p>
          <div className="dish-detail__heading">
            <h1>{dish.name}</h1>
            <FavoriteButton dishId={dish.id} dishName={dish.name} />
          </div>
          <p className="dish-detail__rating">
            ★ {dish.rating.toFixed(1)} ({dish.reviews} reviews)
          </p>
          <p className="dish-detail__price">{formatETB(dish.price)}</p>
          <p className="dish-detail__desc">{dish.description}</p>

          {dish.ingredients?.length > 0 && (
            <div className="dish-detail__ingredients">
              <h2>Key ingredients & flavors</h2>
              <ul>
                {dish.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="dish-detail__qty">
            <span>Quantity</span>
            <div className="qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <Button variant="primary" size="lg" className="btn--full" onClick={handleAddToCart}>
            🛒 Add to Cart · {formatETB(dish.price * quantity)}
          </Button>
          {justAdded && (
            <p className="dish-detail__added" role="status">
              Added to your cart. <Link to="/cart">View cart →</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
