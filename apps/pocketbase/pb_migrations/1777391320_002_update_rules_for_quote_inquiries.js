/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("quote_inquiries");
  collection.listRule = "@request.auth.collectionName = 'admin_users'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users'";
  collection.createRule = "";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("quote_inquiries");
  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
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