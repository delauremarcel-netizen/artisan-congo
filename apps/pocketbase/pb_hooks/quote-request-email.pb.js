/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const clientName = e.record.get("name");
  const clientEmail = e.record.get("email");
  const clientPhone = e.record.get("phone");
  const projectDescription = e.record.get("project_description");
  const location = e.record.get("location");
  const category = e.record.get("category");
  const budget = e.record.get("budget");
  const preferredContactMethod = e.record.get("preferred_contact_method");
  const createdDate = e.record.get("created");

  const htmlBody = `
    <h2>Nouvelle demande de devis</h2>
    <hr>
    <h3>Informations du client</h3>
    <p><strong>Nom:</strong> ${clientName}</p>
    <p><strong>Email:</strong> ${clientEmail}</p>
    <p><strong>Téléphone:</strong> ${clientPhone}</p>
    
    <h3>Détails du projet</h3>
    <p><strong>Description:</strong> ${projectDescription}</p>
    <p><strong>Localisation:</strong> ${location || 'Non spécifiée'}</p>
    <p><strong>Catégorie/Métier:</strong> ${category || 'Non spécifiée'}</p>
    <p><strong>Budget:</strong> ${budget ? budget + ' XAF' : 'Non spécifié'}</p>
    
    <h3>Préférences de contact</h3>
    <p><strong>Méthode de contact préférée:</strong> ${preferredContactMethod || 'Non spécifiée'}</p>
    
    <h3>Date de la demande</h3>
    <p><strong>Date:</strong> ${createdDate}</p>
  `;

  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "contact@artisancongo.com" }],
    subject: "Nouvelle demande de devis - " + clientName,
    html: htmlBody
  });

  $app.newMailClient().send(message);
  e.next();
}, "quote_inquiries");