import { Link } from "react-router-dom";
import { useOrderHistory } from "./orderHistoryStore.jsx";
import OrderHistoryItem from "./OrderHistoryItem.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Button from "../ui/Button.jsx";
import "./OrderHistory.css";

export default function OrderHistory() {
  const { orders } = useOrderHistory();

  return (
    <div className="container section">
      <p className="eyebrow">Order management</p>
      <h1>My Orders</h1>
      <p className="menu-lead">
        Review your past deliveries and reorder favorites in one tap across Addis Ababa.
      </p>

      {orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No previous orders yet"
          message="When you place your first order, you'll be able to track and reorder it here."
          action={
            <Button as={Link} to="/menu" variant="primary">
              Start your first order
            </Button>
          }
        />
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}
