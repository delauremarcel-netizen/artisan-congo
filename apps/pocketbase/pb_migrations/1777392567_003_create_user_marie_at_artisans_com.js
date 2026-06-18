/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "marie@artisans.com");
  record.setPassword("test123456");
  record.set("name", "Marie Tshimba");
  record.set("status", "En attente");
  record.set("category", "Peinture");
  record.set("phone", "243444555666");
  record.set("city", "Brazzaville");
  record.set("bio", "Peintre professionnelle");
  record.set("experience_years", 6);
  record.set("services_offered", "Peinture int\u00e9rieure et ext\u00e9rieure");
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
    const record = app.findFirstRecordByData("artisans", "email", "marie@artisans.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})