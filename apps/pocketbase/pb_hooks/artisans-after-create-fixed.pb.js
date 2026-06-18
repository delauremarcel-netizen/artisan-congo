/// <reference path="../pb_data/types.d.ts" />
// Actions après création d'un artisan
onRecordAfterCreateSuccess((e) => {
  // Log de création
  console.log("Nouvel artisan créé: " + e.record.id + " - " + e.record.get("name"));

  // Initialiser les champs de statistiques s'ils sont vides
  const status = e.record.get("status");
  if (status === "pending") {
    console.log("Artisan en attente de validation: " + e.record.id);
  } else if (status === "active") {
    console.log("Artisan actif: " + e.record.id);
  }

  e.next();
}, "artisans");