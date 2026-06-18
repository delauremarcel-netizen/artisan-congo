/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const category = e.record.get("category");
  const title = e.record.get("title");
  const description = e.record.get("description");
  const budgetRange = e.record.get("budget_range");
  const timeline = e.record.get("timeline");
  const location = e.record.get("location");
  const contactName = e.record.get("contact_name");
  const contactEmail = e.record.get("contact_email");
  const contactPhone = e.record.get("contact_phone");
  const recordId = e.record.id;

  // Find artisans matching the category
  const artisans = $app.findRecordsByFilter("artisan_profiles", `category = '${category}' && profile_visibility = 'visible'`, { limit: 100 });
  
  artisans.forEach((artisan) => {
    const artisanEmail = artisan.get("artisan_id"); // This is the user ID, we need to get the email
    try {
      const artisanUser = $app.findRecordById("users", artisanEmail);
      const artisanUserEmail = artisanUser.get("email");
      
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanUserEmail }],
        subject: "Nouvelle demande de devis: " + title,
        html: "<h2>Nouvelle demande de devis</h2>" +
              "<p><strong>Titre du projet:</strong> " + title + "</p>" +
              "<p><strong>Description:</strong> " + description + "</p>" +
              "<p><strong>Catégorie:</strong> " + category + "</p>" +
              "<p><strong>Budget estimé:</strong> " + (budgetRange || "Non spécifié") + "</p>" +
              "<p><strong>Délai:</strong> " + (timeline || "Non spécifié") + "</p>" +
              "<p><strong>Localisation:</strong> " + (location || "Non spécifié") + "</p>" +
              "<hr>" +
              "<p><strong>Contact client:</strong></p>" +
              "<p>Nom: " + contactName + "</p>" +
              "<p>Email: " + contactEmail + "</p>" +
              "<p>Téléphone: " + contactPhone + "</p>" +
              "<hr>" +
              "<p><a href='https://yoursite.com/quotes/" + recordId + "'>Voir la demande complète</a></p>"
      });
      $app.newMailClient().send(message);
    } catch (err) {
      console.log("Error sending email to artisan: " + err);
    }
  });
  
  e.next();
}, "quote_requests");