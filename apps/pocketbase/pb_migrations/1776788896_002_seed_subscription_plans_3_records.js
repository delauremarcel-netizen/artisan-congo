/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("subscription_plans");

  const record0 = new Record(collection);
    record0.set("plan_name", "Starter Annual");
    record0.set("price", 49.99);
    record0.set("duration", "annual");
    record0.set("description", "Basic visibility, limited profile features");
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
    record1.set("plan_name", "Professional Annual");
    record1.set("price", 99.99);
    record1.set("duration", "annual");
    record1.set("description", "Full profile, priority in search results, featured badge");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("plan_name", "Premium Annual");
    record2.set("price", 199.99);
    record2.set("duration", "annual");
    record2.set("description", "All Professional features + featured on homepage, analytics dashboard, priority support");
  try {
    app.save(record2);
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