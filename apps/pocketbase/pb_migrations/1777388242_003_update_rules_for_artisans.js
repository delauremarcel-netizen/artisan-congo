/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "status = 'Valid\u00e9'";
  collection.viewRule = "status = 'Valid\u00e9' || id = @request.auth.id";
  collection.createRule = "";
  collection.updateRule = "id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "subscription_status = 'active'";
  collection.viewRule = "subscription_status = 'active' || @request.auth.id = id";
  collection.createRule = "";
  collection.updateRule = "id = @request.auth.id";
  collection.deleteRule = "id = @request.auth.id";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})