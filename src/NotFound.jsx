import { Link } from "react-router-dom";
import Button from "./ui/Button.jsx";
import EmptyState from "./ui/EmptyState.jsx";

export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState
        icon="🧭"
        title="Page not found"
        message="The page you're looking for doesn't exist."
        action={
          <Button as={Link} to="/" variant="primary">
            Back to Home
          </Button>
        }
      />
    </div>
  );
}
