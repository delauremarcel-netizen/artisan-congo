/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "pierre.martin@email.com");
  record.setPassword("SecurePass123!");
  record.set("name", "Pierre Martin");
  record.set("category", "Menuiserie");
  record.set("city", "Pointe-Noire");
  record.set("phone", "+242 06 345 6789");
  record.set("status", "Valid\u00e9");
  record.set("is_visible", true);
  record.set("bio", "Menuisier sp\u00e9cialis\u00e9 en portes et fen\u00eatres");
  record.set("average_overall_rating", 4.7);
  record.set("total_ratings", 10);
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
    const record = app.findFirstRecordByData("artisans", "email", "pierre.martin@email.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})