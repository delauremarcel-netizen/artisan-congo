/// <reference path="../pb_data/types.d.ts" />
// Artisan creation validation - VERSION FORMULAIRE SIMPLIFIÉ
// Champs du formulaire : nom, prenom, telephone, metier, password

onRecordCreate((e) => {

  const errors = {};

  // Récupération des champs du formulaire
  const nom       = e.record.get("nom")       || e.record.get("name");
  const prenom    = e.record.get("prenom")     || e.record.get("first_name");
  const telephone = e.record.get("telephone")  || e.record.get("phone") || e.record.get("whatsapp");
  const metier    = e.record.get("metier")     || e.record.get("category") || e.record.get("specialite");

  // ── NOM
  if (!nom || String(nom).trim() === "") {
    errors["nom"] = "Le nom est obligatoire.";
  } else if (String(nom).trim().length < 2) {
    errors["nom"] = "Le nom doit contenir au moins 2 caractères.";
  }

  // ── PRÉNOM
  if (!prenom || String(prenom).trim() === "") {
    errors["prenom"] = "Le prénom est obligatoire.";
  } else if (String(prenom).trim().length < 2) {
    errors["prenom"] = "Le prénom doit contenir au moins 2 caractères.";
  }

  // ── TÉLÉPHONE
  if (!telephone || String(telephone).trim() === "") {
    errors["telephone"] = "Le numéro de téléphone est obligatoire.";
  } else {
    const digits = String(telephone).replace(/\D/g, "");
    if (digits.length < 8) {
      errors["telephone"] = "Le numéro doit contenir au moins 8 chiffres.";
    }
  }

  // ── MÉTIER
  if (!metier || String(metier).trim() === "") {
    errors["metier"] = "Le métier est obligatoire.";
  }

  // ── RETOURNER LES ERREURS
  if (Object.keys(errors).length > 0) {
    throw new BadRequestError("Erreur de validation des données", errors);
  }

  // ── NETTOYAGE
  if (nom)       e.record.set("nom",       String(nom).trim());
  if (prenom)    e.record.set("prenom",    String(prenom).trim());
  if (telephone) e.record.set("telephone", String(telephone).trim());
  if (metier)    e.record.set("metier",    String(metier).trim().toLowerCase());

  // ── VALEURS PAR DÉFAUT
  if (!e.record.get("status"))      e.record.set("status",      "En attente");
  if (!e.record.get("is_visible"))  e.record.set("is_visible",  false);
  if (!e.record.get("is_active"))   e.record.set("is_active",   true);
  if (!e.record.get("account_type")) e.record.set("account_type", "artisan");

  const ratingFields = [
    "average_overall_rating", "average_quality_rating",
    "average_professionalism_rating", "average_punctuality_rating",
    "total_ratings", "number_of_reviews"
  ];
  ratingFields.forEach(f => {
    if (!e.record.get(f)) e.record.set(f, 0);
  });

  e.next();

}, "artisans");