/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const quote_requestsCollection = app.findCollectionByNameOrId("quote_requests");
  const collection = app.findCollectionByNameOrId("quotes");

  const existing = collection.fields.getByName("quote_request_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("quote_request_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "quote_request_id",
    required: false,
    collectionId: quote_requestsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("quotes");
    collection.fields.removeByName("quote_request_id");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})