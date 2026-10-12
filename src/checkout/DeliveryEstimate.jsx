import { getDeliveryArea, getEstimatedDeliveryTime } from "../utils/deliveryEstimate.js";

// Feature 21 — Estimated Delivery Time, derived from the chosen area.
export default function DeliveryEstimate({ areaId }) {
  const area = getDeliveryArea(areaId);
  if (!area) {
    return <p className="delivery-estimate delivery-estimate--muted">Choose an area to see your delivery estimate.</p>;
  }
  return (
    <p className="delivery-estimate">
      ⏱ Estimated delivery to <strong>{area.label}</strong>: {getEstimatedDeliveryTime(areaId)}
    </p>
  );
}
