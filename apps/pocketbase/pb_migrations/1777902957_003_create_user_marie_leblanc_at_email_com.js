/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "marie.leblanc@email.com");
  record.setPassword("SecurePass123!");
  record.set("name", "Marie Leblanc");
  record.set("category", "Plomberie");
  record.set("city", "Brazzaville");
  record.set("phone", "+242 06 234 5678");
  record.set("status", "Valid\u00e9");
  record.set("is_visible", true);
  record.set("bio", "Plombi\u00e8re exp\u00e9riment\u00e9e, travaux r\u00e9sidentiels et commerciaux");
  record.set("average_overall_rating", 4.6);
  record.set("total_ratings", 8);
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
    const record = app.findFirstRecordByData("artisans", "email", "marie.leblanc@email.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})