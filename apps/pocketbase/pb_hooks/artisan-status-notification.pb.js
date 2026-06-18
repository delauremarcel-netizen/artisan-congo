/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatus = e.record.get("status");
  const oldStatus = original.get("status");
  const artisanId = e.record.id;
  
  // Only create notification if status actually changed
  if (newStatus !== oldStatus) {
    let statusChange = null;
    let message = "";
    
    if (newStatus === "Validé") {
      statusChange = "approved";
      message = "Votre profil a été approuvé! Vous êtes maintenant visible sur la plateforme.";
    } else if (newStatus === "Supprimé") {
      statusChange = "rejected";
      message = "Votre demande d'inscription a été refusée.";
    } else if (newStatus === "Suspendu") {
      statusChange = "suspended";
      message = "Votre compte a été suspendu. Vous ne serez pas visible sur la plateforme.";
    } else if (newStatus === "En attente") {
      statusChange = "pending";
      message = "Votre demande est en attente de validation.";
    }
    
    if (statusChange) {
      const notification = new Record($app.findCollectionByNameOrId("notifications"), {
        artisan_id: artisanId,
        message: message,
        status_change: statusChange,
        old_status: oldStatus,
        new_status: newStatus,
        read: false
      });
      
      $app.save(notification);
    }
  }
  
  e.next();
}, "artisans");