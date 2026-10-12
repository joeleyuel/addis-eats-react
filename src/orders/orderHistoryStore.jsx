import { createContext, useContext, useEffect, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage.js";

const OrderHistoryContext = createContext(null);
const STORAGE_KEY = "addis-eats:orders";

function isValidOrder(order) {
  return order && typeof order.id === "string" && Array.isArray(order.items) && Number.isFinite(order.total);
}

function loadInitial() {
  const stored = readJSON(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.filter(isValidOrder) : [];
}

// Feature 16 — Order History. A store, appended to after a successful
// checkout, read by the OrderHistory screen. Also backs feature 19 (Reorder).
export function OrderHistoryProvider({ children }) {
  const [orders, setOrders] = useState(loadInitial);

  useEffect(() => {
    writeJSON(STORAGE_KEY, orders);
  }, [orders]);

  function addOrder(order) {
    let id;
    do {
      id = `ADE-${Math.floor(70000 + Math.random() * 20000)}`;
    } while (orders.some((existing) => existing.id === id));
    const record = {
      id,
      placedAt: new Date().toISOString(),
      status: "Placed",
      ...order,
    };
    setOrders((prev) => [record, ...prev]);
    return record;
  }

  // Admin feature 12 — Update Order Status
  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  }

  // Admin feature 13 — Delete Order
  function deleteOrder(id) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error("useOrderHistory must be used within OrderHistoryProvider");
  return ctx;
}
