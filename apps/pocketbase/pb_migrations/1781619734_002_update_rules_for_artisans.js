/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "@request.auth.id != \"\"";
  collection.viewRule = "@request.auth.id != \"\"";
  collection.createRule = "@request.auth.id != \"\"";
  collection.updateRule = "userId = @request.auth.id";
  collection.deleteRule = "userId = @request.auth.id";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  collection.listRule = "";
  collection.viewRule = "";
  collection.createRule = "@request.auth.role = 'artisan'";
  collection.updateRule = "@request.auth.id = userId";
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
