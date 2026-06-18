/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "sophie.bernard@email.com");
  record.setPassword("SecurePass123!");
  record.set("name", "Sophie Bernard");
  record.set("category", "Peinture");
  record.set("city", "Brazzaville");
  record.set("phone", "+242 06 456 7890");
  record.set("status", "Valid\u00e9");
  record.set("is_visible", true);
  record.set("bio", "Peintre d\u00e9corateur, int\u00e9rieur et ext\u00e9rieur");
  record.set("average_overall_rating", 4.5);
  record.set("total_ratings", 15);
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
    const record = app.findFirstRecordByData("artisans", "email", "sophie.bernard@email.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})