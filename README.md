# Addis Eats — React Frontend

A food-ordering frontend for Addis Ababa, built for the Module 3 mini-project brief
(IBT College Canada · CodeOps). Browse a menu loaded from an API, filter by category, open any
dish on its own page, build an order, and check out through a validated form.

## Run it

```bash
npm install
npm run dev      # development server (usually http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Requires Node 18+.

## Routes

| Path | Screen | Notes |
| --- | --- | --- |
| `/` | Home | Today's specials, link into the menu |
| `/menu` | Menu | Fetched dishes · category in the URL (`?category=Pizza`) · live search |
| `/menu/:id` | Dish | **Dynamic** route · add to cart with quantity |
| `/cart` | Cart | Order lines and the running ETB total |
| `/signin` | Sign in | Mock sign-in (any name + valid Ethiopian mobile number) |
| `/checkout` | Checkout | **Guarded** by sign-in · validated form with touched tracking |
| `/favorites` | Favorites | Saved dishes |
| `/orders` | Order history | One-click reorder |
| `/admin/*` | Admin | **Lazy-loaded** · nested + guarded · demo login `admin` / `addis123` |
| `*` | Not found | Message and a way back |

## Where each brief requirement lives

| Day | Requirement | Where |
| --- | --- | --- |
| 26–27 | Composed components, props, keys, conditional rendering | `Menu.jsx` → `CategoryBar` + `DishCard` list, `Cart.jsx` |
| 28 | State, events, controlled form | `checkout/Checkout.jsx` (fields, touched, submitting) |
| 29 | Fetch in an effect, cleanup on unmount | `hooks/useFetch.js` (AbortController; stale results ignored) |
| 30 | Custom hook + context/store | `useFetch`, `useDebounce` · `cart/cartStore.jsx`, `auth/AuthContext.jsx` |
| 31 | Nested, dynamic and guarded routes | `App.jsx`, `Layout.jsx`, `/menu/:id`, `auth/RequireAuth.jsx`, `admin/AdminApp.jsx` |
| 33–34 | Validation, error boundary, lazy route | `checkout/validate.js` · `ui/ErrorBoundary.jsx` (around every page in `Layout.jsx`) · `React.lazy` admin route in `App.jsx` |

## Where state lives

| State | Lives in | Why |
| --- | --- | --- |
| Selected category | URL query string | Shareable, survives a refresh |
| Search text | `Menu` | Only the menu reads it |
| Fetched dishes | The component that shows them (via `useFetch`) | Nobody else needs them |
| The order (cart) | `cart/cartStore.jsx` | Read on four screens (menu, dish, cart, checkout) + header badge |
| Sign-in session | `auth/AuthContext.jsx` | Rarely changes; needed by the route guard |
| Checkout form fields, touched, submitting | `Checkout` | Nowhere else needs them |
| Modal open/closed | The component that opens it | Local concern |

## Folder layout (grouped by feature)

```
src/
  api/        fetch helpers, one per resource
  hooks/      useFetch, useDebounce — reusable only
  ui/         Button, Modal, Spinner, ErrorBoundary… — no business logic
  utils/      storage, currency formatting, delivery estimate
  cart/  menu/  checkout/  auth/  favorites/  orders/  theme/  admin/
```

## Loading, empty and error states

Every fetch shows a spinner while loading, a message with a **Try again** button on failure
(network down, missing/unreadable data file), and a friendly note when there is nothing to show
(no search results, empty cart, no favorites, no orders, unknown dish). An unknown URL shows the
Not-found page; an unexpected crash while rendering a page shows a recoverable message inside the
layout instead of a blank screen.

## Persistence

Cart, favorites, order history and theme are saved in `localStorage`; the customer and admin
sign-in sessions use `sessionStorage`. Corrupted or blocked storage never crashes the app.
Admin dishes are seeded from `public/menu-data.json` on first run and kept separately from the
customer menu (a demo; a real backend would share one source).

## Notes

- Dish photos are hosted on third-party sites; if one disappears a neutral placeholder is shown.
  See `IMAGE_SOURCES.md` and replace the `image` fields in `public/menu-data.json` with your own
  assets before final submission if you can.
- There is no `.git` history in this folder — create your own repository and commit in small steps
  (`feat: …`, `fix: …`, `refactor: …`) as the brief asks.
