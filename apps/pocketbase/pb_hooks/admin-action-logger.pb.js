/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const auth = e.requestInfo.auth;
  
  if (auth && auth.collectionName === "admin_users") {
    const adminId = auth.id;
    const original = e.record.original();
    
    const oldValue = {};
    const newValue = {};
    let hasChanges = false;
    
    const fieldsToTrack = ["status", "validation_status", "is_visible", "is_active", "suspension_reason", "verified_date"];
    
    fieldsToTrack.forEach(field => {
      const oldVal = original.get(field);
      const newVal = e.record.get(field);
      if (oldVal !== newVal) {
        oldValue[field] = oldVal;
        newValue[field] = newVal;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      try {
        const logRecord = new Record($app.findCollectionByNameOrId("admin_logs"));
        logRecord.set("admin_id", adminId);
        logRecord.set("action_type", "edit_artisan");
        logRecord.set("target_id", e.record.id);
        logRecord.set("target_type", "artisan");
        logRecord.set("old_value", oldValue);
        logRecord.set("new_value", newValue);
        $app.save(logRecord);
      } catch (err) {
        console.log("Error logging admin action: " + err.message);
      }
    }
  }
  
  e.next();
}, "artisans");