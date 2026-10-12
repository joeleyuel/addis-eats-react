import { useMemo, useState } from "react";
import { useAdminDishes } from "./adminDishStore.jsx";
import DishForm from "./DishForm.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import Spinner from "../ui/Spinner.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import FoodImage from "../ui/FoodImage.jsx";
import { formatETB } from "../utils/formatCurrency.js";
import "./DishManager.css";

export default function DishManager() {
  const { dishes, loading, error, addDish, updateDish, deleteDish } = useAdminDishes();
  const [search, setSearch] = useState("");
  const [editingDish, setEditingDish] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Admin feature 10 — Search Dishes
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return dishes;
    return dishes.filter(
      (dish) => dish.name.toLowerCase().includes(query) || dish.category.toLowerCase().includes(query)
    );
  }, [dishes, search]);

  function openAddForm() {
    setEditingDish(null);
    setShowForm(true);
  }

  function openEditForm(dish) {
    setEditingDish(dish);
    setShowForm(true);
  }

  function handleFormSubmit(values) {
    if (editingDish) {
      updateDish(editingDish.id, values);
    } else {
      addDish(values);
    }
    setShowForm(false);
    setEditingDish(null);
  }

  function confirmDelete() {
    if (pendingDelete) {
      deleteDish(pendingDelete.id);
      setPendingDelete(null);
    }
  }

  if (loading) return <Spinner label="Loading admin menu…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Menu Management</h1>
          <p className="admin-lead">{dishes.length} dishes in the catalog</p>
        </div>
        <Button variant="primary" onClick={openAddForm}>
          + Add New Dish
        </Button>
      </div>

      <input
        type="search"
        className="admin-search"
        placeholder="Search dishes by name or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState icon="🍽️" title="No dishes found" message="Try a different search term." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((dish) => (
                <tr key={dish.id}>
                  <td>
                    <div className="admin-table__dish">
                      <FoodImage src={dish.image} alt="" />
                      <span>{dish.name}</span>
                    </div>
                  </td>
                  <td>{dish.category}</td>
                  <td>{formatETB(dish.price)}</td>
                  <td className="admin-table__actions">
                    <button type="button" onClick={() => openEditForm(dish)} aria-label={`Edit ${dish.name}`}>
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(dish)}
                      aria-label={`Delete ${dish.name}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingDish ? "Edit Dish" : "Add New Dish"}
      >
        <DishForm initialDish={editingDish} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} title="Delete this dish?">
        <p>
          Are you sure you want to delete <strong>{pendingDelete?.name}</strong>? This can't be undone.
        </p>
        <div className="admin-form__actions">
          <Button variant="danger" onClick={confirmDelete}>
            Delete dish
          </Button>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
