import { useState } from "react";
import { useOrderHistory } from "../orders/orderHistoryStore.jsx";
import { getDeliveryArea } from "../utils/deliveryEstimate.js";
import { formatETB } from "../utils/formatCurrency.js";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import "./OrderManager.css";

const STATUS_STEPS = ["Placed", "Preparing", "Delivering", "Delivered"];

export default function OrderManager() {
  const { orders, updateOrderStatus, deleteOrder } = useOrderHistory();
  const [viewingOrder, setViewingOrder] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  if (orders.length === 0) {
    return (
      <div>
        <h1>Order Management</h1>
        <EmptyState icon="🧾" title="No orders yet" message="Orders placed by customers will show up here." />
      </div>
    );
  }

  function confirmDelete() {
    if (pendingDelete) {
      deleteOrder(pendingDelete.id);
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <h1>Order Management</h1>
      <p className="admin-lead">{orders.length} total orders</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer?.name}</td>
                <td>{formatETB(order.total)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    aria-label={`Update status for order ${order.id}`}
                  >
                    {STATUS_STEPS.map((step) => (
                      <option key={step} value={step}>
                        {step}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => setViewingOrder(order)} aria-label={`View order ${order.id}`}>
                    👁️
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(order)}
                    aria-label={`Delete order ${order.id}`}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(viewingOrder)} onClose={() => setViewingOrder(null)} title={`Order #${viewingOrder?.id}`}>
        {viewingOrder && (
          <div className="order-details">
            <p>
              <strong>{viewingOrder.customer?.name}</strong> · {viewingOrder.customer?.phone}
            </p>
            <p>{getDeliveryArea(viewingOrder.area)?.label}</p>
            <ul>
              {viewingOrder.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.name} — {formatETB(item.price * item.quantity)}
                </li>
              ))}
            </ul>
            <p className="order-details__total">{formatETB(viewingOrder.total)}</p>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} title="Delete this order?">
        <p>
          Remove order <strong>#{pendingDelete?.id}</strong> from the system? This can't be undone.
        </p>
        <div className="admin-form__actions">
          <Button variant="danger" onClick={confirmDelete}>
            Delete order
          </Button>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
