/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "status = 'Valid\u00e9' && is_visible = true || @request.auth.collectionName = 'admin_users' || id = @request.auth.id";
  collection.viewRule = "status = 'Valid\u00e9' && is_visible = true || @request.auth.collectionName = 'admin_users' || id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "status = 'Valid\u00e9' || @request.auth.collectionName = 'admin_users'";
  collection.viewRule = "status = 'Valid\u00e9' || @request.auth.collectionName = 'admin_users' || id = @request.auth.id";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})