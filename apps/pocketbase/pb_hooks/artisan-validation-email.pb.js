/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const oldStatus = e.record.original().get("status");
  const newStatus = e.record.get("status");
  
  if (oldStatus !== "Validé" && newStatus === "Validé") {
    const artisanName = e.record.get("name");
    const artisanEmail = e.record.get("email");
    
    if (artisanEmail) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanEmail }],
        subject: "Votre profil a été validé!",
        html: "<h2>Bienvenue " + artisanName + "!</h2><p>Votre profil artisan a été validé avec succès.</p><p>Vous pouvez maintenant:</p><ul><li>Recevoir des demandes de devis</li><li>Gérer votre portfolio</li><li>Communiquer avec les clients</li></ul><p>Prochaines étapes:</p><ol><li>Complétez votre profil avec plus de détails</li><li>Ajoutez des photos de vos projets</li><li>Attendez les demandes de clients</li></ol><p>Bonne chance!</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "artisans");