/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("service_requests");
  collection.indexes.push("CREATE UNIQUE INDEX idx_service_requests_request_id ON service_requests (request_id)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("service_requests");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_service_requests_request_id"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})