/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatus = e.record.get("status");
  const oldStatus = original.get("status");
  
  // Only send email if status changed to "Suspendu"
  if (newStatus === "Suspendu" && oldStatus !== "Suspendu") {
    const email = e.record.get("email");
    const name = e.record.get("name");
    
    if (email) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: email }],
        subject: "Votre compte a été suspendu",
        html: "<h2>Suspension de compte</h2><p>Bonjour " + name + ",</p><p>Votre compte a été temporairement suspendu.</p><p>Vous ne serez pas visible sur la plateforme.</p><p>Contactez-nous pour plus d'informations: <a href='mailto:support@artisancongo.com'>support@artisancongo.com</a></p><p>Cordialement,<br>L'équipe Artisan Congo</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "artisans");