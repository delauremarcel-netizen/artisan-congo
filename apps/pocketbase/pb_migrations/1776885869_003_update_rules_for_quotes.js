/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("quotes");
  collection.listRule = "artisan_id = @request.auth.id || company_id = @request.auth.id || @request.auth.collectionName = 'admin_users' || mission_id != ''";
  collection.viewRule = "artisan_id = @request.auth.id || company_id = @request.auth.id || @request.auth.collectionName = 'admin_users' || mission_id != ''";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("quotes");
  collection.listRule = "artisan_id = @request.auth.id || company_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  collection.viewRule = "artisan_id = @request.auth.id || company_id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})