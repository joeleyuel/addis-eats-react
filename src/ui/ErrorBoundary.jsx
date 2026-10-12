import { Component } from "react";
import ErrorState from "./ErrorState.jsx";

// Catches errors thrown while rendering its children, so one broken screen
// shows a recoverable message instead of a blank page.
//   resetKey — when it changes (e.g. the route), the boundary clears itself.
//   reload   — retry reloads the page (needed when a lazy chunk failed to load).
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  handleRetry = () => {
    if (this.props.reload) {
      window.location.reload();
    } else {
      this.setState({ error: null });
    }
  };

  render() {
    if (this.state.error) {
      return (
        <div className="container section">
          <ErrorState
            title="This page hit a problem"
            message="Something unexpected went wrong while showing this page. Your cart is safe."
            onRetry={this.handleRetry}
            retryLabel={this.props.reload ? "Reload page" : "Try again"}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
