/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.indexes.push("CREATE INDEX idx_artisans_status ON artisans (status)");
  collection.indexes.push("CREATE INDEX idx_artisans_created_date ON artisans (created_date)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_artisans_status"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_artisans_created_date"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})