/// <reference path="../pb_data/types.d.ts" />
// Validation création artisan — alignée sur le schéma réel de la collection
// Champs requis : nom, email, categorie, ville, telephone, statut

onRecordCreate((e) => {
  const errors = {};

  const nom       = e.record.get("nom");
  const email     = e.record.get("email");
  const categorie = e.record.get("categorie");
  const ville     = e.record.get("ville");
  const telephone = e.record.get("telephone");

  if (!nom || String(nom).trim().length < 2) {
    errors["nom"] = "Le nom est obligatoire (min. 2 caractères).";
  }

  if (!email || !String(email).includes("@")) {
    errors["email"] = "Un email valide est obligatoire.";
  }

  if (!categorie || String(categorie).trim() === "") {
    errors["categorie"] = "La catégorie (métier) est obligatoire.";
  }

  if (!ville || String(ville).trim() === "") {
    errors["ville"] = "La ville est obligatoire.";
  }

  if (!telephone || String(telephone).replace(/\D/g, "").length < 8) {
    errors["telephone"] = "Un numéro de téléphone valide est obligatoire (min. 8 chiffres).";
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestError("Erreur de validation", errors);
  }

  // Valeur par défaut pour statut
  if (!e.record.get("statut")) {
    e.record.set("statut", "pending");
  }

  // Nettoyage
  e.record.set("nom", String(nom).trim());
  e.record.set("telephone", String(telephone).trim());

  e.next();
}, "artisans");
