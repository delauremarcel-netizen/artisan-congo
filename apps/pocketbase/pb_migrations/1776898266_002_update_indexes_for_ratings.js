/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ratings");
  collection.indexes.push("CREATE UNIQUE INDEX idx_ratings_artisan_user ON ratings (artisan_id, user_id)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("ratings");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_ratings_artisan_user"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})