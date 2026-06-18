/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("commissions_par_ville");
  collection.indexes.push("CREATE UNIQUE INDEX idx_commissions_par_ville_ville ON commissions_par_ville (ville)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("commissions_par_ville");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_commissions_par_ville_ville"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})