/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "jean.dupont@email.com");
  record.setPassword("SecurePass123!");
  record.set("name", "Jean Dupont");
  record.set("category", "\u00c9lectricit\u00e9");
  record.set("city", "Pointe-Noire");
  record.set("phone", "+242 06 123 4567");
  record.set("status", "Valid\u00e9");
  record.set("is_visible", true);
  record.set("bio", "\u00c9lectricien professionnel avec 10 ans d'exp\u00e9rience");
  record.set("average_overall_rating", 4.8);
  record.set("total_ratings", 12);
  record.set("account_type", "artisan");
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("artisans", "email", "jean.dupont@email.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})