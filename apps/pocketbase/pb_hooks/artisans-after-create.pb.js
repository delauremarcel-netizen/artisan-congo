/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // EMAIL SENDING TEMPORARILY DISABLED - SMTP not properly configured
  // Uncomment the code below once SMTP is configured
  
  /*
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "Bienvenue sur notre plateforme!",
    html: "<h1>Bienvenue!</h1><p>Votre compte artisan a été créé avec succès. Veuillez vérifier votre email pour confirmer votre inscription.</p>"
  });
  $app.newMailClient().send(message);
  */
  
  // Continue execution chain - artisan registration completes without email
  e.next();
}, "artisans");