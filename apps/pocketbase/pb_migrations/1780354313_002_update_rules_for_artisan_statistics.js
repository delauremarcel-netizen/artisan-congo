/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_statistics");
  collection.listRule = "artisan_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  collection.viewRule = "artisan_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  collection.createRule = "@request.auth.collectionName = 'admin_users'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisan_statistics");
  collection.listRule = "";
  collection.viewRule = "";
  collection.createRule = "";
  collection.updateRule = "";
  collection.deleteRule = "";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})