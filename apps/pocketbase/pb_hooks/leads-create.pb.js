/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Get artisan details
  const artisanId = e.record.get("artisan_id");
  const artisan = $app.findRecordById("artisan_profiles", artisanId);
  const artisanName = artisan ? artisan.get("name") : "Unknown";
  
  // Get admin users to send notification
  const adminUsers = $app.findRecordsByFilter("admin_users", "role = 'admin'", { limit: 100 });
  
  // Send notification to each admin
  adminUsers.forEach((admin) => {
    const notification = new Record($app.findCollectionByNameOrId("notifications"));
    notification.set("artisan_id", admin.id);
    notification.set("message", "Nouveau lead pour " + artisanName);
    notification.set("read", false);
    $app.save(notification);
  });
  
  // Send notification to the artisan
  const artisanNotification = new Record($app.findCollectionByNameOrId("notifications"));
  artisanNotification.set("artisan_id", artisanId);
  artisanNotification.set("message", "Vous avez un nouveau lead");
  artisanNotification.set("read", false);
  $app.save(artisanNotification);
  
  e.next();
}, "leads");