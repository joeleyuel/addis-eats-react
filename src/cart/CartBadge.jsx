import { useCart } from "./cartStore.jsx";

// Feature 24 — Cart Badge Count
export default function CartBadge() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span className="cart-badge" aria-hidden="true">
      {itemCount}
    </span>
  );
}
