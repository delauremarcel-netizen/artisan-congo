/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatut = e.record.get("statut");
  const oldStatut = original.get("statut");
  
  // Only proceed if status changed to "payé"
  if (newStatut !== "payé" || oldStatut === "payé") {
    e.next();
    return;
  }
  
  // Get artisan info
  const artisanId = e.record.get("artisanId");
  
  if (!artisanId) {
    e.next();
    return;
  }
  
  const artisan = $app.findRecordById("artisans", artisanId);
  if (!artisan) {
    e.next();
    return;
  }
  
  const artisanUserId = artisan.get("userId");
  if (!artisanUserId) {
    e.next();
    return;
  }
  
  // Create notification for artisan
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", artisanUserId);
  notification.set("type", "paiement");
  notification.set("message", "Paiement reçu pour demande. Chantier peut commencer.");
  notification.set("lue", false);
  
  try {
    $app.save(notification);
  } catch (err) {
    console.log("Error creating notification:", err);
  }
  
  e.next();
}, "paiements");