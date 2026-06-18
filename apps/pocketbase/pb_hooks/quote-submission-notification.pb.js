/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const quoteRequestId = e.record.get("quote_request_id");
  const artisanId = e.record.get("artisan_id");
  const amount = e.record.get("amount");
  const timeline = e.record.get("timeline");
  const recordId = e.record.id;

  try {
    // Get quote request details
    const quoteRequest = $app.findRecordById("quote_requests", quoteRequestId);
    const userId = quoteRequest.get("user_id");
    const projectTitle = quoteRequest.get("title");
    
    // Get user email
    const user = $app.findRecordById("users", userId);
    const userEmail = user.get("email");
    
    // Get artisan details
    const artisanProfile = $app.findRecordById("artisan_profiles", artisanId);
    const artisanName = artisanProfile.get("name");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: userEmail }],
      subject: "Nouveau devis reçu pour: " + projectTitle,
      html: "<h2>Vous avez reçu un nouveau devis</h2>" +
            "<p><strong>Artisan:</strong> " + artisanName + "</p>" +
            "<p><strong>Projet:</strong> " + projectTitle + "</p>" +
            "<p><strong>Montant du devis:</strong> " + amount + "</p>" +
            "<p><strong>Délai proposé:</strong> " + (timeline || "Non spécifié") + "</p>" +
            "<hr>" +
            "<p><a href='https://yoursite.com/quotes/" + recordId + "'>Voir le devis complet</a></p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Error sending quote submission email: " + err);
  }
  
  e.next();
}, "quotes");