/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const artisanId = e.record.get("artisan_id");
  const originalRecord = e.record.original();
  const oldStatut = originalRecord ? originalRecord.get("statut") : null;
  const newStatut = e.record.get("statut");
  
  // Update portfolio_count if statut changed
  if (oldStatut !== newStatut) {
    try {
      const artisan = $app.findRecordById("artisan_profiles", artisanId);
      if (artisan) {
        const currentCount = artisan.get("portfolio_count") || 0;
        if (oldStatut === "draft" && newStatut === "public") {
          // Increment when moving from draft to public
          artisan.set("portfolio_count", currentCount + 1);
        } else if (oldStatut === "public" && newStatut === "draft") {
          // Decrement when moving from public to draft
          artisan.set("portfolio_count", Math.max(0, currentCount - 1));
        }
        $app.save(artisan);
      }
    } catch (err) {
      console.log("Error updating artisan portfolio count:", err);
    }
  }
  
  // Log activity to admin_action_logs
  try {
    const logRecord = new Record();
    logRecord.collection().name = "admin_action_logs";
    logRecord.set("admin_id", artisanId);
    logRecord.set("action_type", "portfolio_updated");
    logRecord.set("target_type", "portfolio");
    logRecord.set("target_id", e.record.id);
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging portfolio update:", err);
  }
  
  e.next();
}, "portfolio");