// Feature 10 — Form Validation for the checkout form (name, phone, area, address).
// Pure functions: no React, easy to test on their own.

export function isValidEthiopianPhone(value) {
  const digits = (value || "").replace(/\D/g, "");
  return /^(09|07)\d{8}$/.test(digits) || /^2519\d{8}$/.test(digits) || /^2517\d{8}$/.test(digits);
}

export function validateCheckoutForm(fields) {
  const errors = {};

  if (!fields.name || fields.name.trim().length < 2) {
    errors.name = "Enter your full name (at least 2 characters).";
  }

  if (!isValidEthiopianPhone(fields.phone)) {
    errors.phone = "Enter a valid Ethiopian mobile number, e.g. 0911 234 567.";
  }

  if (!fields.area) {
    errors.area = "Choose a delivery sub-city or neighborhood.";
  }

  if (!fields.address || fields.address.trim().length < 5) {
    errors.address = "Add a building, house number, or landmark.";
  }

  return errors;
}
