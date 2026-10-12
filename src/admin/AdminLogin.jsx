import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth.jsx";
import Button from "../ui/Button.jsx";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAdmin, navigate, redirectTo]);

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="container section admin-login">
      <div className="admin-login__card">
        <p className="eyebrow">Addis Eats · Admin</p>
        <h1>Admin Login</h1>
        <p className="admin-login__lead">Sign in to manage dishes and orders.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" className="btn--full">
            Log in
          </Button>
        </form>
        <p className="admin-login__hint">Demo credentials: admin / addis123</p>
      </div>
    </div>
  );
}
