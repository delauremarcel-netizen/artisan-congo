/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_profiles");

  const existing = collection.fields.getByName("last_whatsapp_click_at");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("last_whatsapp_click_at"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "last_whatsapp_click_at",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisan_profiles");
    collection.fields.removeByName("last_whatsapp_click_at");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})