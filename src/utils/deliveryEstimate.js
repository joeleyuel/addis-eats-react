// Feature 20 — Delivery Fee Calculator
// Feature 21 — Estimated Delivery Time
// Both are derived from the selected delivery area, not stored on their own.

export const DELIVERY_AREAS = [
  { id: "bole", label: "Bole & Medhanialem", fee: 80, etaMinutes: [25, 35] },
  { id: "kazanchis", label: "Kazanchis & Guinea Conakry", fee: 70, etaMinutes: [20, 30] },
  { id: "piassa", label: "Piassa & Arada", fee: 90, etaMinutes: [30, 40] },
  { id: "sarbet", label: "Sarbet & Old Airport", fee: 85, etaMinutes: [25, 35] },
  { id: "cmc", label: "CMC & Ayat Heights", fee: 110, etaMinutes: [35, 45] },
];

export function getDeliveryArea(areaId) {
  return DELIVERY_AREAS.find((area) => area.id === areaId) || null;
}

export function getDeliveryFee(areaId) {
  const area = getDeliveryArea(areaId);
  return area ? area.fee : 0;
}

export function getEstimatedDeliveryTime(areaId) {
  const area = getDeliveryArea(areaId);
  if (!area) return "";
  const [min, max] = area.etaMinutes;
  return `${min}-${max} min`;
}
