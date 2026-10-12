import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./useAdminAuth.jsx";
import { AdminDishProvider } from "./adminDishStore.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminLayout from "./AdminLayout.jsx";
import RequireAdmin from "./RequireAdmin.jsx";
import Dashboard from "./Dashboard.jsx";
import DishManager from "./DishManager.jsx";
import OrderManager from "./OrderManager.jsx";

// Everything under /admin. Admin state (session + dish catalog) is provided here,
// not in main.jsx, because only the admin screens need it.
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminDishProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<DishManager />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminDishProvider>
    </AdminAuthProvider>
  );
}
