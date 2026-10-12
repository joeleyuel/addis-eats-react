import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Route guard for /checkout, per the brief: "Validated order form, guarded behind sign-in".
export default function RequireAuth({ children }) {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
}
