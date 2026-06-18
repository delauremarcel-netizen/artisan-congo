/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("demandes_par_pays");
  collection.indexes.push("CREATE UNIQUE INDEX idx_demandes_par_pays_pays ON demandes_par_pays (pays)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("demandes_par_pays");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_demandes_par_pays_pays"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})