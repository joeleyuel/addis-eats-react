import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage.js";

const CartContext = createContext(null);
const STORAGE_KEY = "addis-eats:cart";

function isValidLine(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Number.isFinite(item.price) &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

// Corrupted or outdated saved data must never crash the app — drop bad lines.
function loadInitialCart() {
  const stored = readJSON(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.filter(isValidLine) : [];
}

// The order/cart — a store read by Menu, Dish, Cart and Checkout.
// Feature 8 — Cart Persistence: survives a refresh via localStorage.
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    writeJSON(STORAGE_KEY, items);
  }, [items]);

  // Feature 4 — Add to Cart
  function addItem(dish, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
          category: dish.category,
          quantity,
        },
      ];
    });
  }

  // Feature 5 — Update Quantity
  function updateQuantity(id, quantity) {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }

  // Feature 6 — Remove from Cart
  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function addMany(dishItems) {
    setItems((prev) => {
      // Copy every line first: state must never be mutated in place.
      const next = prev.map((item) => ({ ...item }));
      dishItems.forEach((dish) => {
        const existing = next.find((item) => item.id === dish.id);
        if (existing) {
          existing.quantity += dish.quantity;
        } else {
          next.push({ ...dish });
        }
      });
      return next;
    });
  }

  // Feature 7 — Live ETB Total
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Feature 24 — Cart Badge Count, derived, no state of its own
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = {
    items,
    addItem,
    addMany,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
