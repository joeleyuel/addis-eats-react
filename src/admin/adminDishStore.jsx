import { createContext, useContext, useEffect, useState } from "react";
import { fetchDishes } from "../api/dishes.js";
import { readJSON, writeJSON } from "../utils/storage.js";

const AdminDishContext = createContext(null);
const STORAGE_KEY = "addis-eats:admin-dishes";

// Admin feature 15 — Data Persistence (all admin dishes saved to localStorage)
// Admin feature 16 — Data Seeding (loaded from menu-data.json on first run)
export function AdminDishProvider({ children }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      setLoading(true);
      setError(null);
      try {
        const stored = readJSON(STORAGE_KEY, null);
        if (Array.isArray(stored) && stored.length > 0) {
          setDishes(stored);
        } else {
          const seeded = await fetchDishes(controller.signal);
          if (controller.signal.aborted) return;
          setDishes(seeded);
          writeJSON(STORAGE_KEY, seeded);
        }
      } catch (err) {
        if (controller.signal.aborted || err.name === "AbortError") return;
        setError(err.message || "Could not load admin menu data.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    init();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loading) {
      writeJSON(STORAGE_KEY, dishes);
    }
  }, [dishes, loading]);

  // Admin feature 7 — Add New Dish
  function addDish(dish) {
    const baseId = dish.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setDishes((prev) => {
      // Ids are React keys and route params — they must be unique.
      let id = baseId || `dish-${Date.now()}`;
      if (prev.some((existing) => existing.id === id)) {
        id = `${id}-${Date.now()}`;
      }
      const newDish = {
        rating: 0,
        reviews: 0,
        prepTime: "15 mins",
        spicy: false,
        vegan: false,
        ingredients: [],
        image: "", // FoodImage shows a placeholder until a real photo is added
        description: dish.shortDescription || "",
        ...dish,
        id,
      };
      return [newDish, ...prev];
    });
  }

  // Admin feature 8 — Edit Dish
  function updateDish(id, updates) {
    setDishes((prev) => prev.map((dish) => (dish.id === id ? { ...dish, ...updates } : dish)));
  }

  // Admin feature 9 — Delete Dish
  function deleteDish(id) {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
  }

  return (
    <AdminDishContext.Provider value={{ dishes, loading, error, addDish, updateDish, deleteDish }}>
      {children}
    </AdminDishContext.Provider>
  );
}

export function useAdminDishes() {
  const ctx = useContext(AdminDishContext);
  if (!ctx) throw new Error("useAdminDishes must be used within AdminDishProvider");
  return ctx;
}
