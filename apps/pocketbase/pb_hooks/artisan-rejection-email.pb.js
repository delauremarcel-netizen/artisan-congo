/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const oldStatus = e.record.original().get("status");
  const newStatus = e.record.get("status");
  
  if (oldStatus !== "Refusé" && newStatus === "Refusé") {
    const artisanName = e.record.get("name");
    const artisanEmail = e.record.get("email");
    const rejectionReason = e.record.get("rejection_reason") || "Votre candidature ne répond pas à nos critères actuels.";
    
    if (artisanEmail) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanEmail }],
        subject: "Votre candidature a été examinée",
        html: "<h2>Bonjour " + artisanName + ",</h2><p>Nous avons examiné votre candidature pour rejoindre notre plateforme d'artisans.</p><p><strong>Raison:</strong> " + rejectionReason + "</p><p>Nous vous encourageons à améliorer votre profil et à réessayer dans le futur.</p><p>Si vous avez des questions, n'hésitez pas à nous contacter.</p><p>Cordialement,<br>L'équipe Artisan Congo</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "artisans");