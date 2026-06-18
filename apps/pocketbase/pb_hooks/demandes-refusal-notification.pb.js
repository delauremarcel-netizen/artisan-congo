/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatut = e.record.get("statut");
  const oldStatut = original.get("statut");
  
  // Only proceed if status changed to "refusée"
  if (newStatut !== "refusée" || oldStatut === "refusée") {
    e.next();
    return;
  }
  
  // Get client and artisan info
  const clientId = e.record.get("clientId");
  const artisanId = e.record.get("artisanId");
  
  if (!clientId || !artisanId) {
    e.next();
    return;
  }
  
  const artisan = $app.findRecordById("artisans", artisanId);
  const artisanNom = artisan ? artisan.get("metier") : "Artisan";
  
  // Create notification for client
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", clientId);
  notification.set("type", "refus");
  notification.set("message", "Votre demande a été refusée par " + artisanNom);
  notification.set("lue", false);
  
  try {
    $app.save(notification);
  } catch (err) {
    console.log("Error creating notification:", err);
  }
  
  e.next();
}, "demandes");