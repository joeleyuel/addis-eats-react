import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cartStore.jsx";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import FoodImage from "../ui/FoodImage.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import "./Cart.css";

export default function Cart() {
  const { items, itemCount, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1>Your Cart</h1>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse the menu and add a few Ethiopian favorites to get started."
          action={
            <Button as={Link} to="/menu" variant="primary">
              Browse dishes
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container section cart-page">
      <div className="cart-page__header">
        <h1>
          Your Cart <span className="cart-page__count">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
        </h1>
        <button type="button" className="cart-page__clear" onClick={clearCart}>
          Clear entire cart
        </button>
      </div>

      <div className="cart-page__grid">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-line">
              <FoodImage src={item.image} alt="" className="cart-line__img" />
              <div className="cart-line__info">
                <h3>{item.name}</h3>
                <span className="cart-line__unit">{formatETB(item.price)} ea</span>
              </div>
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  −
                </button>
                <span aria-live="polite">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Increase ${item.name} quantity`}
                >
                  +
                </button>
              </div>
              <span className="cart-line__total">{formatETB(item.price * item.quantity)}</span>
              <button
                type="button"
                className="cart-line__remove"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary__row">
            <span>Items subtotal</span>
            <span>{formatETB(subtotal)}</span>
          </div>
          <p className="cart-summary__note">Delivery fee and estimated time are calculated at checkout.</p>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Subtotal</span>
            <span>{formatETB(subtotal)}</span>
          </div>
          <Button variant="primary" size="lg" className="btn--full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </Button>
          <Link to="/menu" className="cart-summary__continue">
            ← Continue browsing dishes
          </Link>
        </aside>
      </div>
    </div>
  );
}
