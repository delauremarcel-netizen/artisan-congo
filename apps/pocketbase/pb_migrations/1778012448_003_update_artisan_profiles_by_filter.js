/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("artisan_profiles", "id != ''");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("statut_artisan", "verifie");
    record.set("charte_acceptee", true);
    record.set("phone_verified", true);
    record.set("email_verified", true);
    record.set("badge", "verifie");
    record.set("score_global", 0);
    record.set("rating_average", 0);
    record.set("reviews_count", 0);
    record.set("missions_count", 0);
    record.set("completion_rate", 0);
    record.set("response_rate", 100);
    try {
      app.save(record);
    } catch (e) {
      if (e.message.includes("Value must be unique")) {
        console.log("Record with unique value already exists, skipping");
      } else {
        throw e;
      }
    }
  }
}, (app) => {
  // Rollback: original values not stored, manual restore needed
})