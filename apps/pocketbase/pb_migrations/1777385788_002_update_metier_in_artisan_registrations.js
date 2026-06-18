/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_registrations");
  const field = collection.fields.getByName("metier");
  field.values = ["Plomberie", "\u00c9lectricit\u00e9", "Menuiserie", "Ma\u00e7onnerie", "Peinture", "Carrelage", "Chauffage", "Climatisation", "Serrurerie", "Vitrerie", "Soudure", "R\u00e9paration Auto", "Construction", "Paysagisme", "Couverture", "Serrurerie", "Plomberie Sanitaire", "\u00c9lectricit\u00e9 Industrielle", "Charpenterie", "Vitrerie", "Isolation", "D\u00e9molition", "Terrassement", "B\u00e9ton", "Ferronnerie", "Pl\u00e2trerie", "D\u00e9coration Int\u00e9rieure", "Autre"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisan_registrations");
  const field = collection.fields.getByName("metier");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.values = ["Plomberie", "\u00c9lectricit\u00e9", "Menuiserie", "Ma\u00e7onnerie", "Peinture", "Carrelage", "Chauffage", "Climatisation", "Serrurerie", "Vitrerie", "Autre"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})