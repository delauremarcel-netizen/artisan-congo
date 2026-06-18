/// <reference path="../pb_data/types.d.ts" />
// Hook de diagnostic - Enregistre les informations de création d'artisan
onRecordAfterCreateSuccess((e) => {
  const artisanId = e.record.id;
  const artisanName = e.record.get("name");
  const artisanEmail = e.record.get("email");
  const artisanStatus = e.record.get("status");
  
  console.log("=== DIAGNOSTIC ARTISAN ===");
  console.log("ID: " + artisanId);
  console.log("Nom: " + artisanName);
  console.log("Email: " + artisanEmail);
  console.log("Statut: " + artisanStatus);
  console.log("Création réussie - Pas d'erreur 'Invalid module'");
  console.log("========================");
  
  e.next();
}, "artisans");