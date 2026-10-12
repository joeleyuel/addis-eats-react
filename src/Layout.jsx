import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CartBadge from "./cart/CartBadge.jsx";
import ThemeToggle from "./theme/ThemeToggle.jsx";
import ErrorBoundary from "./ui/ErrorBoundary.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import "./Layout.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Explore Menu" },
  { to: "/favorites", label: "Favorites" },
  { to: "/orders", label: "Order History" },
];

export default function Layout() {
  const { user, isSignedIn, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // A new page should start at the top, not wherever the last one was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <NavLink to="/" className="brand">
            <span aria-hidden="true">🍲</span> Addis Eats
          </NavLink>
          <span className="brand-location">📍 Bole, Addis Ababa</span>

          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="primary-navigation"
            className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="site-nav__link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />
            <NavLink to="/cart" className="cart-link" aria-label="View cart">
              🛍️
              <CartBadge />
            </NavLink>
            <span className="user-chip" title={isSignedIn ? user.phone : "Not signed in"}>
              {isSignedIn ? user.name.split(" ")[0] : "Guest"}
            </span>
            {isSignedIn && (
              <button type="button" className="signout-btn" onClick={signOut}>
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Error boundary around the page region: a crash in one screen keeps the header and nav alive. */}
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <p className="brand">
              <span aria-hidden="true">🍲</span> Addis Eats
            </p>
            <p>Connecting the culinary heart of Addis Ababa to your dining table, delivered fast.</p>
          </div>
          <div>
            <h4>Service Neighborhoods</h4>
            <p>Bole & Medhanialem</p>
            <p>Kazanchis & Guinea Conakry</p>
            <p>Piassa & Arada</p>
          </div>
          <div>
            <h4>Payment Methods</h4>
            <p>Telebirr Direct Pay</p>
            <p>CBE Birr & Mobile Banking</p>
            <p>Cash on Hand-off (ETB)</p>
          </div>
          <div>
            <h4>Support & Inquiries</h4>
            <p>Call Center: 8122 (Toll Free)</p>
            <p>support@addiseats.et</p>
          </div>
        </div>
        <div className="container site-footer__bottom">
          © {new Date().getFullYear()} Addis Eats Delivery Service. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
