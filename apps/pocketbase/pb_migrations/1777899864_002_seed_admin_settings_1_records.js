/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_settings");

  const record0 = new Record(collection);
    record0.set("site_name", "ArtisanCongo");
    record0.set("site_description", "Plateforme de connexion entre clients et artisans");
    record0.set("contact_email", "contact@artisancongo.com");
    record0.set("support_email", "support@artisancongo.com");
    record0.set("commission_rate", 10);
    record0.set("require_email_verification", false);
    record0.set("require_phone_verification", false);
    record0.set("auto_approve_artisans", false);
    record0.set("artisan_registration_enabled", true);
    record0.set("client_registration_enabled", true);
  try {
    app.save(record0);
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