/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");

  const existing = collection.fields.getByName("number_of_reviews");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("number_of_reviews"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "number_of_reviews",
    required: false,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisans");
    collection.fields.removeByName("number_of_reviews");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})