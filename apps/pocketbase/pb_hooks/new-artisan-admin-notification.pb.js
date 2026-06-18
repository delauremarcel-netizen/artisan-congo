/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const status = e.record.get("status");
  
  if (status === "En attente") {
    const artisanName = e.record.get("name");
    const artisanCategory = e.record.get("category") || "Non spécifiée";
    const artisanCity = e.record.get("city") || "Non spécifiée";
    const artisanPhone = e.record.get("phone") || "Non fourni";
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: "admin@artisancongo.com" }],
      subject: "Nouvelle candidature artisan",
      html: "<h2>Nouvelle candidature artisan</h2><p><strong>Nom:</strong> " + artisanName + "</p><p><strong>Catégorie:</strong> " + artisanCategory + "</p><p><strong>Ville:</strong> " + artisanCity + "</p><p><strong>Téléphone:</strong> " + artisanPhone + "</p><p>Veuillez examiner cette candidature dans le tableau de bord administrateur.</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "artisans");