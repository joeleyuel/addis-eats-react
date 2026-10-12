import { useMemo } from "react";
import { useOrderHistory } from "../orders/orderHistoryStore.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import EmptyState from "../ui/EmptyState.jsx";
import "./Dashboard.css";

const STATUS_STEPS = ["Placed", "Preparing", "Delivering", "Delivered"];

export default function Dashboard() {
  const { orders } = useOrderHistory();

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount ? revenue / orderCount : 0;

    // Admin feature 4 — Top Selling Dishes
    const dishTotals = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        dishTotals[item.name] = (dishTotals[item.name] || 0) + item.quantity;
      });
    });
    const topDishes = Object.entries(dishTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Admin feature 5 — Order Status Distribution
    const statusCounts = STATUS_STEPS.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
    orders.forEach((order) => {
      const status = STATUS_STEPS.includes(order.status) ? order.status : "Placed";
      statusCounts[status] += 1;
    });

    return { revenue, orderCount, avgOrderValue, topDishes, statusCounts };
  }, [orders]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="admin-lead">Revenue, orders and menu performance across Addis Eats.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Revenue</span>
          <strong>{formatETB(stats.revenue)}</strong>
        </div>
        <div className="stat-card">
          <span>Order count</span>
          <strong>{stats.orderCount}</strong>
        </div>
        <div className="stat-card">
          <span>Average order value</span>
          <strong>{formatETB(stats.avgOrderValue)}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="admin-panel">
          <h2>Top Selling Dishes</h2>
          {stats.topDishes.length === 0 ? (
            <EmptyState icon="📈" title="No sales yet" message="Top dishes appear once orders are placed." />
          ) : (
            <ol className="top-dish-list">
              {stats.topDishes.map(([name, qty]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="top-dish-list__qty">{qty} sold</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="admin-panel">
          <h2>Order Status Distribution</h2>
          <div className="status-bars">
            {STATUS_STEPS.map((status) => {
              const count = stats.statusCounts[status];
              const pct = stats.orderCount ? Math.round((count / stats.orderCount) * 100) : 0;
              return (
                <div key={status} className="status-bar-row">
                  <span className="status-bar-row__label">{status}</span>
                  <div className="status-bar-row__track">
                    <div className="status-bar-row__fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="status-bar-row__count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
