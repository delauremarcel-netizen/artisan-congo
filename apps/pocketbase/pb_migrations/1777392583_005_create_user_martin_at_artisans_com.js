/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const record = new Record(collection);
  record.set("email", "martin@artisans.com");
  record.setPassword("test123456");
  record.set("name", "Martin Dupont");
  record.set("status", "En attente");
  record.set("category", "Plomberie");
  record.set("phone", "243123456789");
  record.set("city", "Brazzaville");
  record.set("bio", "Plombier professionnel");
  record.set("experience_years", 5);
  record.set("services_offered", "Installation et r\u00e9paration");
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
    const record = app.findFirstRecordByData("artisans", "email", "martin@artisans.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})