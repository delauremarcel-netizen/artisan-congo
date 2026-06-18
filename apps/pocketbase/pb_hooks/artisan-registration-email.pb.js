/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const nom = e.record.get("nom");
  const metier = e.record.get("metier");
  const telephone = e.record.get("telephone");
  const localisation = e.record.get("localisation");
  const description = e.record.get("description");
  const status = e.record.get("status");
  const recordId = e.record.id;

  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "contact@artisancongo.com" }],
    subject: "Nouvelle inscription artisan - " + nom,
    html: `
      <h2>Nouvelle inscription artisan</h2>
      <p><strong>ID d'inscription:</strong> ${recordId}</p>
      <p><strong>Nom:</strong> ${nom}</p>
      <p><strong>Métier:</strong> ${metier}</p>
      <p><strong>Téléphone:</strong> ${telephone}</p>
      <p><strong>Localisation:</strong> ${localisation}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Statut:</strong> ${status}</p>
      <p>Veuillez consulter le tableau de bord pour examiner et approuver cette inscription.</p>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "artisan_registrations");