/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "jean@artisans.com");
  record.setPassword("test123456");
  record.set("name", "Jean Mukadi");
  record.set("status", "Valid\u00e9");
  record.set("category", "\u00c9lectricit\u00e9");
  record.set("phone", "243987654321");
  record.set("city", "Kinshasa");
  record.set("bio", "\u00c9lectricien exp\u00e9riment\u00e9");
  record.set("experience_years", 8);
  record.set("services_offered", "Installation \u00e9lectrique");
  record.set("subscription_status", "active");
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
    const record = app.findFirstRecordByData("artisans", "email", "jean@artisans.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})