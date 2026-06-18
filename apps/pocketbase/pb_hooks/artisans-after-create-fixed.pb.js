/// <reference path="../pb_data/types.d.ts" />
// DÉSACTIVÉ — loguait e.record.get("name") qui n'existe pas dans le schéma actuel
// et causait des erreurs silencieuses dans la chaîne d'exécution.
onRecordAfterCreateSuccess((e) => {
  console.log("Nouvel artisan créé: " + e.record.id + " - " + e.record.get("nom"));
  e.next();
}, "artisans");
