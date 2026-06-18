/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_profiles");
  collection.listRule = "profile_visibility = 'visible'";
  collection.viewRule = "profile_visibility = 'visible' || artisan_id = @request.auth.id";
  collection.createRule = "artisan_id = @request.auth.id";
  collection.updateRule = "artisan_id = @request.auth.id";
  collection.deleteRule = "artisan_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisan_profiles");
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