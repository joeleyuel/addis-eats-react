import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth.jsx";
import "./AdminLayout.css";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", end: true, icon: "📊" },
  { to: "/admin/menu", label: "Menu", icon: "🍽️" },
  { to: "/admin/orders", label: "Orders", icon: "🧾" },
];

// Nested layout: sidebar + <Outlet />, guarded behind RequireAdmin.
export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">🍲 Addis Eats <span>Admin</span></div>
        <nav aria-label="Admin">
          {ADMIN_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="admin-sidebar__link">
              <span aria-hidden="true">{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>Signed in as {admin?.username}</span>
          <button type="button" className="admin-sidebar__logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
