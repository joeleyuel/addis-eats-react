import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Button from "../ui/Button.jsx";
import { isValidEthiopianPhone } from "../checkout/validate.js";
import "./SignIn.css";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/checkout";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length < 2 || !isValidEthiopianPhone(phone)) {
      setError("Enter your name and a valid Ethiopian mobile number, e.g. 0911 234 567.");
      return;
    }
    signIn({ name: name.trim(), phone: phone.trim() });
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="container section signin">
      <div className="signin__card">
        <p className="eyebrow">Sign in required</p>
        <h1>Sign in to check out</h1>
        <p className="signin__lead">
          Checkout is reserved for signed-in customers so we can confirm your order and keep your delivery
          details safe.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abebe Kebede"
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>Mobile number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0911 234 567"
              autoComplete="tel"
            />
          </label>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" className="btn--full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
