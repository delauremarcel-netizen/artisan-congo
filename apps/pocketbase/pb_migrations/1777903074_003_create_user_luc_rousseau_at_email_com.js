/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "luc.rousseau@email.com");
  record.setPassword("SecurePass123!");
  record.set("name", "Luc Rousseau");
  record.set("category", "Chauffage");
  record.set("city", "Pointe-Noire");
  record.set("phone", "+242 06 567 8901");
  record.set("status", "Valid\u00e9");
  record.set("is_visible", true);
  record.set("bio", "Sp\u00e9cialiste en entretien et maintenance de syst\u00e8mes de chauffage");
  record.set("average_overall_rating", 4.9);
  record.set("total_ratings", 20);
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
    const record = app.findFirstRecordByData("artisans", "email", "luc.rousseau@email.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})