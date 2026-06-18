/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_profiles");

  const existing = collection.fields.getByName("charte_acceptee");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("charte_acceptee"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "charte_acceptee",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisan_profiles");
    collection.fields.removeByName("charte_acceptee");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})