/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("factures");
  collection.indexes.push("CREATE UNIQUE INDEX idx_factures_numero_facture ON factures (numero_facture)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("factures");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_factures_numero_facture"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})