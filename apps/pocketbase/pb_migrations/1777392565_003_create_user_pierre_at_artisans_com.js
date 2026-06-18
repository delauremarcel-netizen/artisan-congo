/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "pierre@artisans.com");
  record.setPassword("test123456");
  record.set("name", "Pierre Nkosi");
  record.set("status", "Valid\u00e9");
  record.set("category", "Menuiserie");
  record.set("phone", "243555666777");
  record.set("city", "Pointe-Noire");
  record.set("bio", "Menuisier qualifi\u00e9");
  record.set("experience_years", 10);
  record.set("services_offered", "Fabrication et installation");
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
    const record = app.findFirstRecordByData("artisans", "email", "pierre@artisans.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})