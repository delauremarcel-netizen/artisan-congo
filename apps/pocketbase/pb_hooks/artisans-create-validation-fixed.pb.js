/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  // Validate email format
  const email = e.record.get("email");
  if (!email || !email.includes("@")) {
    throw new BadRequestError("Invalid email format");
  }

  // Validate name is not empty
  const name = e.record.get("name");
  if (!name || name.trim() === "") {
    throw new BadRequestError("Name is required");
  }

  // Validate category is selected
  const category = e.record.get("category");
  if (!category) {
    throw new BadRequestError("Category is required");
  }

  // Validate city is selected
  const city = e.record.get("city");
  if (!city) {
    throw new BadRequestError("City is required");
  }

  // Set default status to "En attente" if not provided
  if (!e.record.get("status")) {
    e.record.set("status", "En attente");
  }

  // Set default account_type to "artisan"
  if (!e.record.get("account_type")) {
    e.record.set("account_type", "artisan");
  }

  e.next();
}, "artisans");