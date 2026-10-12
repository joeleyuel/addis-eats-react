import { createContext, useContext, useEffect, useState } from "react";
import { readJSON, removeKey, writeJSON } from "../utils/storage.js";

const AdminAuthContext = createContext(null);
const SESSION_KEY = "addis-eats:admin-session";

// Admin feature 1 — Admin Login
// Admin feature 2 — Session Management, kept via context + sessionStorage
// Demo credentials: admin / addis123
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = readJSON(SESSION_KEY, null, "session");
    return stored && stored.username === "admin" ? stored : null;
  });

  useEffect(() => {
    if (admin) {
      writeJSON(SESSION_KEY, admin, "session");
    } else {
      removeKey(SESSION_KEY, "session");
    }
  }, [admin]);

  function login(username, password) {
    if (username.trim().toLowerCase() === "admin" && password === "addis123") {
      setAdmin({ username: "admin" });
      return { ok: true };
    }
    return { ok: false, message: "Incorrect username or password." };
  }

  // Admin feature 17 — Logout
  function logout() {
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isAdmin: Boolean(admin), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
