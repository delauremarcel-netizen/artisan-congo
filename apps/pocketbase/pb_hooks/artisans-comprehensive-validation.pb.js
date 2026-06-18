/// <reference path="../pb_data/types.d.ts" />
// Validation complète et sécurisée pour les artisans
onRecordCreate((e) => {
  // Récupérer tous les champs requis
  const name = e.record.get("name");
  const email = e.record.get("email");
  const category = e.record.get("category");
  const city = e.record.get("city");
  const status = e.record.get("status");
  const whatsapp = e.record.get("whatsapp");

  // Tableau des validations
  const validations = [];

  // 1. Validation du nom
  if (!name || typeof name !== "string" || name.trim() === "") {
    validations.push("Le nom de l'artisan est requis et doit être non vide");
  } else if (name.length < 2) {
    validations.push("Le nom doit contenir au moins 2 caractères");
  } else if (name.length > 255) {
    validations.push("Le nom ne peut pas dépasser 255 caractères");
  }

  // 2. Validation de l'email (géré par PocketBase, mais vérification supplémentaire)
  if (!email || typeof email !== "string" || email.trim() === "") {
    validations.push("L'email est requis");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validations.push("Format d'email invalide");
    }
  }

  // 3. Validation de la catégorie
  const validCategories = [
    "Électricien", "Plombier", "Maçon", "Peintre", "Carreleur", "Serrurier", "Vitrier", "Couvreur",
    "Chauffagiste", "Climaticien", "Menuisier", "Charpentier", "Ébéniste", "Décorateur", "Nettoyeur",
    "Agent d'entretien piscine", "Jardinier", "Paysagiste", "Gardien", "Chauffeur", "Mécanicien",
    "Soudeur", "Électroménager", "Réparateur téléphone", "Coiffeur", "Barbier", "Esthéticienne",
    "Masseur", "Cuisinier", "Boulanger", "Boucher", "Poissonnier", "Traiteur", "Serveur", "Barman",
    "Photographe", "Vidéographe", "Graphiste", "Musicien", "DJ", "Animateur", "Événementiel",
    "Décorateur événements", "Informaticien", "Développeur web", "Consultant", "Formateur",
    "Traducteur", "Rédacteur", "Journaliste", "Avocat", "Notaire", "Comptable", "Consultant RH",
    "Médecin", "Infirmier", "Dentiste", "Pharmacien", "Vétérinaire", "Kinésithérapeute",
    "Psychologue", "Coach", "Formateur professionnel", "Fleuriste", "Réceptionniste", "Secrétaire", "Autre"
  ];
  if (!category || !validCategories.includes(category)) {
    validations.push("La catégorie doit être sélectionnée parmi les options valides");
  }

  // 4. Validation de la ville
  const validCities = ["Pointe-Noire", "Brazzaville", "Kinshasa", "Lubumbashi", "Kolwezi"];
  if (!city || !validCities.includes(city)) {
    validations.push("La ville doit être sélectionnée parmi les options valides");
  }

  // 5. Validation du statut
  const validStatuses = ["pending", "active"];
  if (!status || !validStatuses.includes(status)) {
    validations.push("Le statut doit être 'pending' ou 'active'");
  }

  // 6. Validation du WhatsApp
  if (!whatsapp || typeof whatsapp !== "string" || whatsapp.trim() === "") {
    validations.push("Le numéro WhatsApp est requis");
  } else {
    const digitsOnly = whatsapp.replace(/\D/g, "");
    if (digitsOnly.length < 8) {
      validations.push("Le numéro WhatsApp doit contenir au moins 8 chiffres");
    } else if (digitsOnly.length > 15) {
      validations.push("Le numéro WhatsApp ne peut pas dépasser 15 chiffres");
    }
  }

  // Si des erreurs de validation, les lever
  if (validations.length > 0) {
    throw new BadRequestError(validations.join("; "));
  }

  e.next();
}, "artisans");