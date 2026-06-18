/// <reference path="../pb_data/types.d.ts" />
onRecordAfterDeleteSuccess((e) => {
  const artisanId = e.record.get("artisan_id");
  
  // Decrement portfolio_count in artisan_profiles
  try {
    const artisan = $app.findRecordById("artisan_profiles", artisanId);
    if (artisan) {
      const currentCount = artisan.get("portfolio_count") || 0;
      artisan.set("portfolio_count", Math.max(0, currentCount - 1));
      $app.save(artisan);
    }
  } catch (err) {
    console.log("Error updating artisan portfolio count:", err);
  }
  
  // Log activity to admin_action_logs
  try {
    const logRecord = new Record();
    logRecord.collection().name = "admin_action_logs";
    logRecord.set("admin_id", artisanId);
    logRecord.set("action_type", "portfolio_deleted");
    logRecord.set("target_type", "portfolio");
    logRecord.set("target_id", e.record.id);
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging portfolio deletion:", err);
  }
  
  e.next();
}, "portfolio");