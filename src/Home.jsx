import { Link } from "react-router-dom";
import { fetchDishes } from "./api/dishes.js";
import { useFetch } from "./hooks/useFetch.js";
import DishCard from "./menu/DishCard.jsx";
import Spinner from "./ui/Spinner.jsx";
import ErrorState from "./ui/ErrorState.jsx";
import Button from "./ui/Button.jsx";
import FoodImage from "./ui/FoodImage.jsx";
import "./Home.css";

const SPECIAL_IDS = ["doro-wot-deluxe", "sizzling-shekla-tibs", "addis-special-kitfo", "gourmet-beyaynetu"];

export default function Home() {
  const { data: dishes, loading, error, reload } = useFetch(fetchDishes, []);
  const specials = dishes ? dishes.filter((d) => SPECIAL_IDS.includes(d.id)) : [];

  return (
    <div>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Addis Ababa · 30–45m drop-off · Telebirr & CBE ready</p>
            <h1 className="hero__title">
              Delicious food, <span className="hero__accent">delivered in Addis.</span>
            </h1>
            <p className="hero__lead">
              Authentic Ethiopian traditional stews, sizzling tibs, and farm-fresh fasting delights brought
              straight to your doorstep across Bole, Kazanchis, Old Airport, and beyond.
            </p>
            <div className="hero__actions">
              <Button as={Link} to="/menu" variant="primary" size="lg">
                Explore Menu →
              </Button>
              <Button as={Link} to="/menu" variant="secondary" size="lg">
                Today's Specials
              </Button>
            </div>
            <dl className="hero__stats">
              <div>
                <dt>140+</dt>
                <dd>Local eateries</dd>
              </div>
              <div>
                <dt>32m</dt>
                <dd>Avg delivery</dd>
              </div>
              <div>
                <dt>4.9★</dt>
                <dd>Customer love</dd>
              </div>
            </dl>
          </div>
          <div className="hero__media">
            <FoodImage
              src="https://farm8.staticflickr.com/7380/10306762905_89a731d88b_o.jpg"
              alt="A traditional Ethiopian feast spread on injera"
            />
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="feature-strip">
          <div className="feature-strip__item">
            <span aria-hidden="true">🍽️</span>
            <div>
              <h3>Authentic & Fresh</h3>
              <p>Cooked to order every morning by Addis Ababa's finest culinary institutions and home cooks.</p>
            </div>
          </div>
          <div className="feature-strip__item">
            <span aria-hidden="true">⚡</span>
            <div>
              <h3>Swift Delivery</h3>
              <p>Real-time motorbike tracking from Bole and Kazanchis all the way to CMC and Sarbet.</p>
            </div>
          </div>
          <div className="feature-strip__item">
            <span aria-hidden="true">💳</span>
            <div>
              <h3>Easy Local Pay</h3>
              <p>Seamless checkout with Telebirr, CBE Birr mobile PIN, or cash hand-off at your door.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Handpicked daily curations</p>
            <h2>Today's Specials</h2>
            <p>Chef's curated favorites with special prices · Fresh batches ready now</p>
          </div>
          <Link to="/menu" className="section-heading__link">
            View full menu →
          </Link>
        </div>

        {loading && <Spinner label="Loading today's specials…" />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && (
          <div className="grid-cards">
            {specials.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <div className="promo-banner">
          <div>
            <p className="eyebrow eyebrow--light">First time on Addis Eats?</p>
            <h2>Order with confidence across Addis Ababa</h2>
            <p className="promo-banner__lead">
              Enjoy freshly prepared authentic meals with guaranteed rapid delivery to Bole, Kazanchis,
              Piassa, and beyond.
            </p>
            <div className="promo-banner__code">
              <span>PROMO CODE</span>
              <strong>ADDISFIRST</strong>
            </div>
          </div>
          <Button as={Link} to="/menu" variant="accent" size="lg">
            Claim Discount & Order
          </Button>
        </div>
      </section>
    </div>
  );
}
