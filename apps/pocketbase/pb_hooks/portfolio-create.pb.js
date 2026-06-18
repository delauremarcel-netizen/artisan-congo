/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const artisanId = e.record.get("artisan_id");
  
  // Increment portfolio_count in artisan_profiles
  try {
    const artisan = $app.findRecordById("artisan_profiles", artisanId);
    if (artisan) {
      const currentCount = artisan.get("portfolio_count") || 0;
      artisan.set("portfolio_count", currentCount + 1);
      $app.save(artisan);
    }
  } catch (err) {
    console.log("Error updating artisan portfolio count:", err);
  }
  
  // Log activity to admin_action_logs
  try {
    const logRecord = new Record();
    logRecord.collection().name = "admin_action_logs";
    logRecord.set("admin_id", e.record.get("artisan_id"));
    logRecord.set("action_type", "portfolio_created");
    logRecord.set("target_type", "portfolio");
    logRecord.set("target_id", e.record.id);
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging portfolio creation:", err);
  }
  
  e.next();
}, "portfolio");