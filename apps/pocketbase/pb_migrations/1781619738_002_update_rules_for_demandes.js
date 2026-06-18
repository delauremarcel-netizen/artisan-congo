/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("demandes");
  collection.listRule = "clientId = @request.auth.id || artisanId.userId = @request.auth.id || @request.auth.role = 'admin'";
  collection.viewRule = "clientId = @request.auth.id || artisanId.userId = @request.auth.id || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.id != \"\"";
  collection.updateRule = "clientId = @request.auth.id || artisanId.userId = @request.auth.id || @request.auth.role = 'admin'";
  collection.deleteRule = "clientId = @request.auth.id || @request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("demandes");
  collection.listRule = "@request.auth.id = clientId || @request.auth.id = artisanId || @request.auth.role = 'admin'";
  collection.viewRule = "@request.auth.id = clientId || @request.auth.id = artisanId || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.role = 'client'";
  collection.updateRule = "@request.auth.role = 'admin' || (@request.auth.id = artisanId && statut = 'en attente')";
  collection.deleteRule = null;
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
