/// <reference path="../pb_data/types.d.ts" />
// artisan-password-hash.pb.js - VERSION CORRIGÉE
// ⚠️ SI LA COLLECTION ARTISANS EST DE TYPE AUTH :
// PocketBase gère le hashing du mot de passe automatiquement.
// Ce fichier ne doit PAS interférer avec ce mécanisme.
// Il vérifie uniquement les règles de complexité AVANT soumission.

onRecordCreate((e) => {

  // Sécurité : ne traiter que la collection artisans
  if (e.record.collection().name !== "artisans") {
    e.next();
    return;
  }

  // ════════════════════════════════════════
  // Pour une collection Auth PocketBase :
  // Le mot de passe est géré via e.record.get("password")
  // uniquement pendant la création, jamais stocké en clair
  // ════════════════════════════════════════

  const errors = {};
  const password = e.record.get("password");

  // Vérifier uniquement si un mot de passe est fourni
  // (les updates sans changement de mdp ne passent pas ici)
  if (password && typeof password === "string") {

    // Longueur minimale
    if (password.length < 8) {
      errors["password"] = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    // Au moins une majuscule
    else if (!/[A-Z]/.test(password)) {
      errors["password"] = "Le mot de passe doit contenir au moins une majuscule.";
    }

    // Au moins un chiffre
    else if (!/[0-9]/.test(password)) {
      errors["password"] = "Le mot de passe doit contenir au moins un chiffre.";
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestError("Mot de passe invalide", errors);
    }
  }

  // PocketBase Auth hash automatiquement — ne pas re-hasher manuellement
  e.next();

}, "artisans");