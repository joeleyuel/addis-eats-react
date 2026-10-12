import { useState } from "react";
import Button from "../ui/Button.jsx";

const CATEGORIES = ["Ethiopian", "Pizza", "Burgers", "Drinks"];

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = "Enter a dish name (at least 2 characters).";
  }
  const price = Number(form.price);
  if (form.price === "" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than 0 ETB.";
  }
  return errors;
}

export default function DishForm({ initialDish, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialDish?.name || "",
    category: initialDish?.category || "Ethiopian",
    price: initialDish?.price ?? "",
    shortDescription: initialDish?.shortDescription || "",
  });
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(form) : {};

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(form)).length > 0) return;
    onSubmit({ ...form, name: form.name.trim(), price: Math.round(Number(form.price)) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Dish name</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={errors.name ? "true" : undefined}
          required
        />
        {errors.name && (
          <span className="field-error" role="alert">
            <span aria-hidden="true">⚠ </span>
            {errors.name}
          </span>
        )}
      </label>
      <label className="field">
        <span>Category</span>
        <select value={form.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Price (ETB)</span>
        <input
          type="number"
          min="1"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          aria-invalid={errors.price ? "true" : undefined}
          required
        />
        {errors.price && (
          <span className="field-error" role="alert">
            <span aria-hidden="true">⚠ </span>
            {errors.price}
          </span>
        )}
      </label>
      <label className="field">
        <span>Description</span>
        <textarea value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
      </label>
      <div className="admin-form__actions">
        <Button type="submit" variant="primary">
          {initialDish ? "Save changes" : "Add dish"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
