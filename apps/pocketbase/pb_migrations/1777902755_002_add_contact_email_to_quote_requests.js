/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("quote_requests");

  const existing = collection.fields.getByName("contact_email");
  if (existing) {
    if (existing.type === "email") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("contact_email"); // exists with wrong type, remove first
  }

  collection.fields.add(new EmailField({
    name: "contact_email",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("quote_requests");
    collection.fields.removeByName("contact_email");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})