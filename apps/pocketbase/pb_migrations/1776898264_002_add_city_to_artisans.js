/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");

  const existing = collection.fields.getByName("city");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("city"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "city",
    required: false,
    values: ["Pointe-Noire", "Brazzaville", "Kinshasa", "Lubumbashi", "Kolwezi"]
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisans");
    collection.fields.removeByName("city");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})