import { createContext, useContext, useEffect, useState } from "react";
import { readJSON, removeKey, writeJSON } from "../utils/storage.js";

const AuthContext = createContext(null);
const SESSION_KEY = "addis-eats:session";

function loadSession() {
  const stored = readJSON(SESSION_KEY, null, "session");
  return stored && typeof stored.name === "string" && typeof stored.phone === "string" ? stored : null;
}

// Sign-in session — Context, rarely changes, needed by the route guard.
// This is a lightweight mock sign-in (no real backend): entering a name
// and phone "signs in" the customer. It lasts for the browser session, so a
// reload on /checkout does not throw the customer back to the sign-in page.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  useEffect(() => {
    if (user) {
      writeJSON(SESSION_KEY, user, "session");
    } else {
      removeKey(SESSION_KEY, "session");
    }
  }, [user]);

  function signIn({ name, phone }) {
    setUser({ name, phone });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: Boolean(user), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
