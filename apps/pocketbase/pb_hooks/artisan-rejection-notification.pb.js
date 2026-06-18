/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only trigger if status changed to 'Supprimé' from a non-Validé status
  if (currentStatus === "Supprimé" && previousStatus !== "Validé") {
    // Create notification record
    const notification = new Record($app.findCollectionByNameOrId("notifications"), {
      artisan_id: e.record.id,
      type: "rejection",
      message: "Votre demande d'inscription a été refusée. Veuillez contacter contact@artisancongo.com pour plus d'informations.",
      read: false
    });
    $app.save(notification);
    
    // Send rejection email
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") }],
      subject: "Demande Refusée - Artisan Congo",
      html: "<h2>Demande d'Inscription Refusée</h2><p>Nous regrettons de vous informer que votre demande d'inscription sur la plateforme Artisan Congo a été refusée.</p><p>Si vous avez des questions ou souhaitez obtenir plus d'informations sur les raisons de ce refus, veuillez contacter notre équipe de support.</p><p>Cordialement,<br>L'équipe Artisan Congo<br><a href=\"mailto:contact@artisancongo.com\">contact@artisancongo.com</a></p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "artisans");