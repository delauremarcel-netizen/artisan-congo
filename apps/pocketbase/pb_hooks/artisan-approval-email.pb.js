/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatus = e.record.get("status");
  const oldStatus = original.get("status");
  
  // Only send email if status changed to "Validé"
  if (newStatus === "Validé" && oldStatus !== "Validé") {
    const email = e.record.get("email");
    const name = e.record.get("name");
    
    if (email) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: email }],
        subject: "Votre profil a été approuvé!",
        html: "<h2>Félicitations " + name + "!</h2><p>Votre profil a été approuvé et vous êtes maintenant visible sur la plateforme Artisan Congo.</p><p>Vous pouvez maintenant recevoir des demandes de clients.</p><p>Cordialement,<br>L'équipe Artisan Congo</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "artisans");