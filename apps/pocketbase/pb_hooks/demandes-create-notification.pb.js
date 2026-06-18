/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Get the artisan record to access userId
  const artisanId = e.record.get("artisanId");
  if (!artisanId) {
    e.next();
    return;
  }
  
  const artisan = $app.findRecordById("artisans", artisanId);
  if (!artisan) {
    e.next();
    return;
  }
  
  const artisanUserId = artisan.get("userId");
  if (!artisanUserId) {
    e.next();
    return;
  }
  
  // Get client info for message
  const clientId = e.record.get("clientId");
  const client = $app.findRecordById("users", clientId);
  const clientNom = client ? client.get("nom") : "Client";
  const metier = e.record.get("metier");
  
  // Create notification record
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", artisanUserId);
  notification.set("type", "demande");
  notification.set("message", "Nouvelle demande de " + clientNom + " pour " + metier);
  notification.set("lue", false);
  
  try {
    $app.save(notification);
  } catch (err) {
    console.log("Error creating notification:", err);
  }
  
  // Send email notification if artisan has email
  const artisanUser = $app.findRecordById("users", artisanUserId);
  if (artisanUser && artisanUser.get("email")) {
    try {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: artisanUser.get("email") }],
        subject: "Nouvelle demande de travail",
        html: "<h2>Nouvelle demande</h2><p>Vous avez reçu une nouvelle demande de <strong>" + clientNom + "</strong> pour <strong>" + metier + "</strong>.</p><p>Veuillez consulter votre tableau de bord pour plus de détails.</p>"
      });
      $app.newMailClient().send(message);
    } catch (err) {
      console.log("Error sending email:", err);
    }
  }
  
  e.next();
}, "demandes");