import { createContext, useContext, useEffect, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage.js";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "addis-eats:favorites";

function loadInitial() {
  const stored = readJSON(STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
}

// Feature 17 — Favorites / Wishlist. A store, persisted to localStorage,
// read by DishCard hearts and the Favorites screen.
export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(loadInitial);

  useEffect(() => {
    writeJSON(STORAGE_KEY, favoriteIds);
  }, [favoriteIds]);

  function toggleFavorite(id) {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function isFavorite(id) {
    return favoriteIds.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
