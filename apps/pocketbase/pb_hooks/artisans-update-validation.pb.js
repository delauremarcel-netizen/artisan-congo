/// <reference path="../pb_data/types.d.ts" />
// ARTISAN UPDATE VALIDATION - VERSION CORRIGÉE
// Valide les données lors de la modification du profil artisan

onRecordUpdate((e) => {

  const errors = {};

  const name = e.record.get("name");
  const email = e.record.get("email");
  const whatsapp = e.record.get("whatsapp");
  const category = e.record.get("category");
  const city = e.record.get("city");

  // ════════════════════════════════════════
  // NOM — ne peut pas être vidé après création
  // ════════════════════════════════════════
  if (name !== null && name !== undefined) {
    if (String(name).trim() === "") {
      errors["name"] = "Le nom ne peut pas être vide.";
    } else if (String(name).trim().length < 2) {
      errors["name"] = "Le nom doit contenir au moins 2 caractères.";
    }
  }

  // ════════════════════════════════════════
  // EMAIL — validé si modifié
  // ════════════════════════════════════════
  if (email !== null && email !== undefined && String(email).trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      errors["email"] = "L'adresse email n'est pas valide.";
    }
  }

  // ════════════════════════════════════════
  // WHATSAPP — validé si modifié
  // ════════════════════════════════════════
  if (whatsapp !== null && whatsapp !== undefined && String(whatsapp).trim() !== "") {
    const digits = String(whatsapp).replace(/\D/g, "");
    if (digits.length < 8) {
      errors["whatsapp"] = "Le numéro WhatsApp doit contenir au moins 8 chiffres.";
    } else if (digits.length > 15) {
      errors["whatsapp"] = "Le numéro WhatsApp ne peut pas dépasser 15 chiffres.";
    }
  }

  // ════════════════════════════════════════
  // CATÉGORIE — validée si modifiée
  // ════════════════════════════════════════
  if (category !== null && category !== undefined && String(category).trim() !== "") {
    const validCategories = [
      "menuiserie", "electricite", "plomberie",
      "maconnerie", "couture", "peinture", "sculpture", "autre"
    ];
    if (!validCategories.includes(String(category).trim().toLowerCase())) {
      errors["category"] = `Catégorie invalide. Valeurs acceptées : ${validCategories.join(", ")}.`;
    }
  }

  // ════════════════════════════════════════
  // VILLE — validée si modifiée
  // ════════════════════════════════════════
  if (city !== null && city !== undefined && String(city).trim() !== "") {
    const validCities = ["brazzaville", "pointe-noire", "dolisie", "autre"];
    if (!validCities.includes(String(city).trim().toLowerCase())) {
      errors["city"] = `Ville invalide. Valeurs acceptées : ${validCities.join(", ")}.`;
    }
  }

  // ════════════════════════════════════════
  // RETOURNER LES ERREURS SI PRÉSENTES
  // ════════════════════════════════════════
  if (Object.keys(errors).length > 0) {
    throw new BadRequestError("Erreur de validation des données", errors);
  }

  // ════════════════════════════════════════
  //  ════════════════════════════════════════
  // NETTOYAGE DES DONNÉES VALIDES
  // ════════════════════════════════════════
  if (name) e.record.set("name", String(name).trim());
  if (email) e.record.set("email", String(email).trim().toLowerCase());
  if (category) e.record.set("category", String(category).trim().toLowerCase());
  if (city) e.record.set("city", String(city).trim().toLowerCase());

  e.next();

}, "artisans");