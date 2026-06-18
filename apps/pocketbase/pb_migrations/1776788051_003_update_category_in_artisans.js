/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("category");
  field.values = ["Plomberie", "Menuiserie", "\u00c9lectricit\u00e9", "Ma\u00e7onnerie", "Peinture", "Soudure", "R\u00e9paration Auto", "Construction", "Paysagisme", "Carrelage", "Couverture", "Serrurerie", "Climatisation", "Plomberie Sanitaire", "\u00c9lectricit\u00e9 Industrielle", "Charpenterie", "Vitrerie", "Chauffage", "Isolation", "D\u00e9molition", "Terrassement", "B\u00e9ton", "Ferronnerie", "Pl\u00e2trerie", "D\u00e9coration Int\u00e9rieure"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("category");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.values = ["plumbing", "carpentry", "electricity", "masonry", "painting", "welding", "auto repair", "construction", "landscaping"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})