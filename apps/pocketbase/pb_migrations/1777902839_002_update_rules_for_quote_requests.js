/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("quote_requests");
  collection.listRule = "user_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  collection.viewRule = "user_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("quote_requests");
  collection.listRule = "@request.auth.collectionName = 'admin_users'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})