/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("reviews");

  const existing = collection.fields.getByName("quality_rating");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("quality_rating"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "quality_rating",
    required: true,
    min: 1,
    max: 5
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("reviews");
    collection.fields.removeByName("quality_rating");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})