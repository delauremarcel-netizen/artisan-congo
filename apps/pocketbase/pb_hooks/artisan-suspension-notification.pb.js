/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only trigger if status changed to 'Suspendu'
  if (currentStatus === "Suspendu" && previousStatus !== "Suspendu") {
    // Create notification record
    const notification = new Record($app.findCollectionByNameOrId("notifications"), {
      artisan_id: e.record.id,
      type: "suspension",
      message: "Votre compte a été suspendu temporairement. Veuillez contacter contact@artisancongo.com pour plus d'informations.",
      read: false
    });
    $app.save(notification);
    
    // Send suspension email
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") }],
      subject: "Compte Suspendu - Artisan Congo",
      html: "<h2>Suspension de Compte</h2><p>Votre compte sur la plateforme Artisan Congo a été suspendu temporairement.</p><p>Si vous pensez que c'est une erreur ou si vous avez des questions, veuillez contacter notre équipe de support dès que possible.</p><p>Cordialement,<br>L'équipe Artisan Congo<br><a href=\"mailto:contact@artisancongo.com\">contact@artisancongo.com</a></p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "artisans");