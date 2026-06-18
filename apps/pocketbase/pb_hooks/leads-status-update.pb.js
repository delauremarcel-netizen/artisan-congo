/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = e.record.get("status");
  
  // Only proceed if status changed
  if (oldStatus === newStatus) {
    e.next();
    return;
  }
  
  const artisanId = e.record.get("artisan_id");
  const clientEmail = e.record.get("client_email");
  const clientName = e.record.get("client_name");
  
  // Get artisan details for notifications
  const artisan = $app.findRecordById("artisan_profiles", artisanId);
  const artisanEmail = artisan ? artisan.get("email") : null;
  
  // Status: devis_envoye - send email to client
  if (newStatus === "devis_envoye" && clientEmail) {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: clientEmail }],
      subject: "Votre devis a été envoyé",
      html: "<h2>Bonjour " + (clientName || "Client") + "</h2><p>Votre devis a été envoyé par l'artisan. Veuillez vérifier votre email pour plus de détails.</p>"
    });
    $app.newMailClient().send(message);
  }
  
  // Status: payé - send notification to artisan
  if (newStatus === "payé") {
    const notification = new Record($app.findCollectionByNameOrId("notifications"));
    notification.set("artisan_id", artisanId);
    notification.set("message", "Un lead a été marqué comme payé");
    notification.set("read", false);
    $app.save(notification);
    
    // Also send email if artisan email exists
    if (artisanEmail) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanEmail }],
        subject: "Lead marqué comme payé",
        html: "<h2>Notification de paiement</h2><p>Un de vos leads a été marqué comme payé.</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  // Status: terminé - send email to client
  if (newStatus === "terminé" && clientEmail) {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: clientEmail }],
      subject: "Votre projet est terminé",
      html: "<h2>Bonjour " + (clientName || "Client") + "</h2><p>Votre projet a été marqué comme terminé. Merci d'avoir utilisé nos services!</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "leads");