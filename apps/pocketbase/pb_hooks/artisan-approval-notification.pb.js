/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only trigger if status changed to 'Validé'
  if (currentStatus === "Validé" && previousStatus !== "Validé") {
    // Create notification record
    const notification = new Record($app.findCollectionByNameOrId("notifications"), {
      artisan_id: e.record.id,
      type: "approval",
      message: "Félicitations! Votre profil a été approuvé et vous êtes maintenant visible sur la plateforme Artisan Congo!",
      read: false
    });
    $app.save(notification);
    
    // Send approval email
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") }],
      subject: "Profil Approuvé - Artisan Congo",
      html: "<h2>Félicitations!</h2><p>Votre profil a été approuvé et vous êtes maintenant visible sur la plateforme Artisan Congo.</p><p>Vous pouvez maintenant:</p><ul><li>Recevoir des demandes de devis des clients</li><li>Gérer votre portefeuille de projets</li><li>Communiquer directement avec les clients</li></ul><p>Bienvenue sur Artisan Congo!</p><p>Cordialement,<br>L'équipe Artisan Congo<br><a href=\"mailto:contact@artisancongo.com\">contact@artisancongo.com</a></p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "artisans");