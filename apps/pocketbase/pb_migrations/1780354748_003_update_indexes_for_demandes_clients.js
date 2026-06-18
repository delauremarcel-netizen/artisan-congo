/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("demandes_clients");
  collection.indexes.push("CREATE UNIQUE INDEX idx_demandes_clients_numero_unique ON demandes_clients (numero_unique)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("demandes_clients");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_demandes_clients_numero_unique"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})