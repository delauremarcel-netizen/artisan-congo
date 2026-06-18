/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");

  const record0 = new Record(collection);
    record0.set("name", "Martin");
    record0.set("email", "martin@artisans.com");
    record0.setPassword("SecurePass123!");
    record0.set("category", "Plomberie");
    record0.set("bio", "Expert plumber with 10 years of experience");
    record0.set("experience_years", 10);
    record0.set("services_offered", "Plumbing repairs, installations, maintenance");
    record0.set("subscription_status", "active");
    record0.set("city", "Brazzaville");
    record0.set("account_type", "artisan");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Marcel");
    record1.set("email", "marcel@artisans.com");
    record1.setPassword("SecurePass123!");
    record1.set("category", "\u00c9lectricit\u00e9");
    record1.set("bio", "Professional electrician with 15 years of experience");
    record1.set("experience_years", 15);
    record1.set("services_offered", "Electrical installations, repairs, maintenance");
    record1.set("subscription_status", "active");
    record1.set("city", "Kinshasa");
    record1.set("account_type", "artisan");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})