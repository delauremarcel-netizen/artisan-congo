/// <reference path="../pb_data/types.d.ts" />
// Fix: s'assurer que la createRule de la collection artisans
// autorise tout utilisateur authentifié (et non pas role-restricted)
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("artisans");
    collection.createRule = "@request.auth.id != \"\"";
    collection.listRule   = "";
    collection.viewRule   = "";
    collection.updateRule = "@request.auth.id != \"\"";
    collection.deleteRule = "@request.auth.role = \"admin\"";
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection artisans introuvable, migration ignorée");
      return;
    }
    throw e;
  }
}, (app) => {
  // revert: no-op intentionnel
});
