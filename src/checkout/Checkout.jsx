import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/cartStore.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { useOrderHistory } from "../orders/orderHistoryStore.jsx";
import { validateCheckoutForm } from "./validate.js";
import { DELIVERY_AREAS, getDeliveryFee, getEstimatedDeliveryTime } from "../utils/deliveryEstimate.js";
import { formatETB } from "../utils/formatCurrency.js";
import Field from "./Field.jsx";
import DeliveryEstimate from "./DeliveryEstimate.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import "./Checkout.css";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrderHistory();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    area: "",
    address: "",
    // Feature 23 — Special Instructions, lives only in the Checkout component
    instructions: "",
  });
  // Touched tracking: an error only shows once the customer has visited the
  // field (or tried to submit), so the form never greets them with red text.
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="container section">
        <h1>Checkout</h1>
        <EmptyState
          icon="🧾"
          title="Nothing to check out yet"
          message="Add a dish or two from the menu before heading to checkout."
        />
      </div>
    );
  }

  function updateField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched(key) {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }

  // Errors are derived from the fields on every render — no stale error state.
  const allErrors = validateCheckoutForm(fields);
  const errors = Object.fromEntries(Object.entries(allErrors).filter(([key]) => touched[key]));

  const deliveryFee = getDeliveryFee(fields.area);
  const total = subtotal + deliveryFee;

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const invalidKeys = Object.keys(allErrors);
    if (invalidKeys.length > 0) {
      setTouched({ name: true, phone: true, area: true, address: true });
      document.getElementById(invalidKeys[0])?.focus();
      return;
    }

    setSubmitting(true);

    // Feature 11 — Order Confirmation
    const order = addOrder({
      customer: { name: fields.name, phone: fields.phone },
      area: fields.area,
      address: fields.address,
      instructions: fields.instructions,
      items,
      subtotal,
      deliveryFee,
      total,
    });
    setConfirmedOrder(order);
    clearCart();
  }

  return (
    <div className="container section checkout-page">
      <h1>Checkout</h1>

      {!confirmedOrder && (
        <div className="checkout-page__grid">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <section className="checkout-section">
              <h2>1. Delivery Location & Contact</h2>
              <Field label="Recipient full name" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  type="text"
                  value={fields.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  autoComplete="name"
                />
              </Field>
              <Field label="Ethiopian mobile number" htmlFor="phone" error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0911 234 567"
                  value={fields.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => markTouched("phone")}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Delivery sub-city / neighborhood" htmlFor="area" error={errors.area}>
                <select
                  id="area"
                  value={fields.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  onBlur={() => markTouched("area")}
                >
                  <option value="">Select an area…</option>
                  {DELIVERY_AREAS.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Building, house number & landmarks" htmlFor="address" error={errors.address}>
                <input
                  id="address"
                  type="text"
                  placeholder="Near Friendship Business Center, House #402, 3rd Floor"
                  value={fields.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => markTouched("address")}
                  autoComplete="street-address"
                />
              </Field>
              <Field label="Special instructions (optional)" htmlFor="instructions">
                <textarea
                  id="instructions"
                  placeholder="e.g. Extra spicy mitmita, contactless drop-off at the gate…"
                  value={fields.instructions}
                  onChange={(e) => updateField("instructions", e.target.value)}
                />
              </Field>
              <DeliveryEstimate areaId={fields.area} />
            </section>

            <Button type="submit" variant="primary" size="lg" className="btn--full" disabled={submitting}>
              {submitting ? "Placing order…" : `Place Order · ${formatETB(total)}`}
            </Button>
          </form>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            <ul className="checkout-summary__list">
              {items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatETB(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-summary__row">
              <span>Dishes subtotal</span>
              <span>{formatETB(subtotal)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Delivery fee</span>
              <span>{fields.area ? formatETB(deliveryFee) : "—"}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total amount</span>
              <span>{formatETB(total)}</span>
            </div>
            {fields.area && (
              <p className="checkout-summary__eta">
                Estimated delivery time: {getEstimatedDeliveryTime(fields.area)}
              </p>
          )}
        </aside>
      </div>
      )}

      <Modal
        open={Boolean(confirmedOrder)}
        onClose={() => navigate("/orders")}
        title="Order confirmed! 🎉"
      >
        {confirmedOrder && (
          <>
            <p>
              Thanks, {confirmedOrder.customer.name.split(" ")[0]}! Order <strong>#{confirmedOrder.id}</strong>{" "}
              is on its way. We'll deliver to {DELIVERY_AREAS.find((a) => a.id === confirmedOrder.area)?.label}
              {" "}in about {getEstimatedDeliveryTime(confirmedOrder.area)}.
            </p>
            <p className="checkout-confirm__total">{formatETB(confirmedOrder.total)}</p>
            <div className="checkout-confirm__actions">
              <Button variant="primary" onClick={() => navigate("/orders")}>
                View order history
              </Button>
              <Button variant="secondary" onClick={() => navigate("/menu")}>
                Keep browsing
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
