import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { CartProvider } from "./cart/cartStore.jsx";
import { FavoritesProvider } from "./favorites/favoritesStore.jsx";
import { OrderHistoryProvider } from "./orders/orderHistoryStore.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <OrderHistoryProvider>
            <FavoritesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </FavoritesProvider>
          </OrderHistoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
