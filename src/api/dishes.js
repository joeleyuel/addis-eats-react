// One fetch helper per resource. Stands in for a real backend call —
// swap the URL for a real API endpoint and the rest of the app is unaffected.

const MENU_URL = `${import.meta.env.BASE_URL}menu-data.json`;

export const DISH_NOT_FOUND_MESSAGE = "We couldn't find that dish. It may have been removed from the menu.";

// `signal` lets the caller cancel the request (see hooks/useFetch.js).
export async function fetchDishes(signal) {
  let response;
  try {
    response = await fetch(MENU_URL, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Could not reach the menu. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("Could not load the menu. Please try again.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    // e.g. the file is missing and the dev server answered with an HTML page
    throw new Error("The menu data is unavailable right now. Please try again later.");
  }

  if (!Array.isArray(data)) {
    throw new Error("The menu data is unavailable right now. Please try again later.");
  }
  return data;
}

export async function fetchDishById(id, signal) {
  const dishes = await fetchDishes(signal);
  const dish = dishes.find((d) => d.id === id);
  if (!dish) {
    throw new Error(DISH_NOT_FOUND_MESSAGE);
  }
  return dish;
}
