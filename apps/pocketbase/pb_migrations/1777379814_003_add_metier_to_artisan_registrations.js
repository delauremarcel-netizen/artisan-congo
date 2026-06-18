/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_registrations");

  const existing = collection.fields.getByName("metier");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("metier"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "metier",
    required: true,
    values: ["Plomberie", "\u00c9lectricit\u00e9", "Menuiserie", "Ma\u00e7onnerie", "Peinture", "Carrelage", "Chauffage", "Climatisation", "Serrurerie", "Vitrerie", "Autre"]
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisan_registrations");
    collection.fields.removeByName("metier");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})