/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("city");
  field.values = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Pointe-Noire", "Brazzaville", "Autre"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("city");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.values = ["Pointe-Noire", "Brazzaville", "Kinshasa", "Lubumbashi", "Kolwezi"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})