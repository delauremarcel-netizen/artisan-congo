/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_profiles");

  const existing = collection.fields.getByName("response_rate");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("response_rate"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "response_rate",
    required: false,
    min: 0,
    max: 100
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisan_profiles");
    collection.fields.removeByName("response_rate");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})