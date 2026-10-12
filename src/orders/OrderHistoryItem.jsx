import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/cartStore.jsx";
import Button from "../ui/Button.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import { getDeliveryArea } from "../utils/deliveryEstimate.js";

export default function OrderHistoryItem({ order }) {
  const { addMany } = useCart();
  const navigate = useNavigate();
  const area = getDeliveryArea(order.area);
  const placedDate = new Date(order.placedAt);

  // Feature 19 — Reorder Functionality
  function handleReorder() {
    addMany(order.items);
    navigate("/cart");
  }

  return (
    <li className="order-card">
      <div className="order-card__header">
        <div>
          <h3>#{order.id}</h3>
          <p className="order-card__meta">
            {placedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at{" "}
            {placedDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            {area ? ` · ${area.label}` : ""}
          </p>
        </div>
        <span className="order-card__status">✓ {order.status}</span>
      </div>

      <p className="order-card__items">
        {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
      </p>

      <div className="order-card__footer">
        <span className="order-card__total">{formatETB(order.total)}</span>
        <Button variant="primary" size="sm" onClick={handleReorder}>
          ↻ Reorder All Items
        </Button>
      </div>
    </li>
  );
}
