// Feature 26 — Formatted Currency (ETB)
// Formats a number as Ethiopian Birr with thousands separators, e.g. 1528 -> "1,528 ETB"
export function formatETB(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} ETB`;
}
