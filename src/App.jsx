import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Menu from "./menu/Menu.jsx";
import DishDetail from "./menu/DishDetail.jsx";
import Cart from "./cart/Cart.jsx";
import Checkout from "./checkout/Checkout.jsx";
import Favorites from "./favorites/Favorites.jsx";
import OrderHistory from "./orders/OrderHistory.jsx";
import SignIn from "./auth/SignIn.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import NotFound from "./NotFound.jsx";
import ErrorBoundary from "./ui/ErrorBoundary.jsx";
import Spinner from "./ui/Spinner.jsx";

// The admin area is only for staff, so customers never download its code:
// it is split into its own chunk and loaded the first time /admin is opened.
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<DishDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Lazy-loaded admin route group (has its own nested + guarded routes inside AdminApp) */}
      <Route
        path="/admin/*"
        element={
          <ErrorBoundary reload>
            <Suspense
              fallback={
                <div className="container section">
                  <Spinner label="Loading admin…" />
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}
