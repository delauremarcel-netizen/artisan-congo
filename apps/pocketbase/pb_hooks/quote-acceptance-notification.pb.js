/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const status = e.record.get("status");
  const original = e.record.original();
  const originalStatus = original.get("status");
  
  // Only send email if status changed to "Accepté"
  if (status === "Accept\u00e9" && originalStatus !== "Accept\u00e9") {
    const quoteRequestId = e.record.get("quote_request_id");
    const artisanId = e.record.get("artisan_id");
    
    try {
      // Get quote request details
      const quoteRequest = $app.findRecordById("quote_requests", quoteRequestId);
      const projectTitle = quoteRequest.get("title");
      
      // Get artisan details
      const artisanProfile = $app.findRecordById("artisan_profiles", artisanId);
      const artisanUserId = artisanProfile.get("artisan_id");
      
      // Get artisan email
      const artisanUser = $app.findRecordById("users", artisanUserId);
      const artisanEmail = artisanUser.get("email");
      
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanEmail }],
        subject: "Votre devis a été accepté: " + projectTitle,
        html: "<h2>Félicitations! Votre devis a été accepté</h2>" +
              "<p><strong>Projet:</strong> " + projectTitle + "</p>" +
              "<p>Le client a accepté votre devis. Veuillez prendre contact avec le client pour les détails du projet et les prochaines étapes.</p>" +
              "<hr>" +
              "<p><strong>Prochaines étapes:</strong></p>" +
              "<ul>" +
              "<li>Contactez le client pour confirmer les détails</li>" +
              "<li>Planifiez la date de début du projet</li>" +
              "<li>Assurez-vous que tous les matériaux sont disponibles</li>" +
              "</ul>"
      });
      $app.newMailClient().send(message);
    } catch (err) {
      console.log("Error sending quote acceptance email: " + err);
    }
  }
  
  e.next();
}, "quotes");