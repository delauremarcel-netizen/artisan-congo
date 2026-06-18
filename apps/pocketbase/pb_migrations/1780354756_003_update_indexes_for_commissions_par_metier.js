/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("commissions_par_metier");
  collection.indexes.push("CREATE UNIQUE INDEX idx_commissions_par_metier_metier ON commissions_par_metier (metier)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("commissions_par_metier");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_commissions_par_metier_metier"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})