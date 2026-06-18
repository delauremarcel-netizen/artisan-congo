/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("category");
  field.required = true;
  field.values = ["\u00c9lectricien", "Plombier", "Menuisier", "Ma\u00e7on", "Peintre", "Carreleur", "Serrurier", "Charpentier", "Couvreur", "Vitrier", "Chauffagiste", "Climaticien", "\u00c9lectrom\u00e9nager", "Informatique", "T\u00e9l\u00e9phonie", "Autre"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("artisans");
  const field = collection.fields.getByName("category");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.required = false;
  field.values = ["\u00c9lectricien", "Plombier", "Ma\u00e7on", "Peintre", "Carreleur", "Serrurier", "Vitrier", "Couvreur", "Chauffagiste", "Climaticien", "Menuisier", "Charpentier", "\u00c9b\u00e9niste", "D\u00e9corateur", "Nettoyeur", "Agent d'entretien piscine", "Jardinier", "Paysagiste", "Gardien", "Chauffeur", "M\u00e9canicien", "Soudeur", "\u00c9lectrom\u00e9nager", "R\u00e9parateur t\u00e9l\u00e9phone", "Coiffeur", "Barbier", "Esth\u00e9ticienne", "Masseur", "Cuisinier", "Boulanger", "Boucher", "Poissonnier", "Traiteur", "Serveur", "Barman", "Photographe", "Vid\u00e9ographe", "Graphiste", "Musicien", "DJ", "Animateur", "\u00c9v\u00e9nementiel", "D\u00e9corateur \u00e9v\u00e9nements", "Informaticien", "D\u00e9veloppeur web", "Consultant", "Formateur", "Traducteur", "R\u00e9dacteur", "Journaliste", "Avocat", "Notaire", "Comptable", "Consultant RH", "M\u00e9decin", "Infirmier", "Dentiste", "Pharmacien", "V\u00e9t\u00e9rinaire", "Kin\u00e9sith\u00e9rapeute", "Psychologue", "Coach", "Formateur professionnel", "Fleuriste", "R\u00e9ceptionniste", "Secr\u00e9taire", "P\u00e2tissier", "Plongeur", "Couturier", "Staffeur", "Autre"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})