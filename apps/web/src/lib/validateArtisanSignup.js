export const validateName = (name) => {
  if (!name || name.trim().length < 2) return "Veuillez entrer un nom valide";
  if (name.trim().length > 100) return "Le nom ne peut pas dépasser 100 caractères.";
  return null;
};

export const validateFirstName = (firstName) => {
  if (!firstName || firstName.trim().length < 2) return "Veuillez entrer un prénom valide";
  if (firstName.trim().length > 100) return "Le prénom ne peut pas dépasser 100 caractères.";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Veuillez entrer un téléphone valide (+242 ou 0)";
  const cleanPhone = phone.replace(/\s/g, '');
  const re = /^(\+242|0)[0-9]{8,}$/;
  if (!re.test(cleanPhone)) return "Veuillez entrer un téléphone valide (+242 ou 0)";
  return null;
};

export const validateWhatsApp = (phone) => {
  if (!phone) return "Le numéro WhatsApp est obligatoire.";
  const cleanPhone = phone.replace(/\s/g, '');
  const re = /^(\+242|0)[0-9]{8,}$/;
  if (!re.test(cleanPhone)) return "Format invalide. Utilisez +242 XXX XXX XXX ou 0XXX XXX XXX.";
  return null;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "L'adresse email est obligatoire.";
  if (!re.test(email)) return "Veuillez entrer une adresse email valide.";
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères";
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Veuillez confirmer votre mot de passe.";
  if (password !== confirmPassword) return "Les mots de passe ne correspondent pas.";
  return null;
};

export const validateCity = (city) => {
  if (!city) return "Veuillez sélectionner une ville.";
  return null;
};

export const validateCategory = (category) => {
  const validCategories = [
    'Électricien', 'Plombier', 'Menuisier', 'Maçon', 'Peintre', 
    'Carreleur', 'Serrurier', 'Charpentier', 'Couvreur', 'Vitrier', 
    'Chauffagiste', 'Climaticien', 'Électroménager', 'Informatique', 
    'Téléphonie', 'Autre'
  ];
  if (!category || !validCategories.includes(category)) return "Veuillez sélectionner un métier";
  return null;
};

export const validateExperience = (experience) => {
  if (experience === undefined || experience === null || experience === '') {
    return "Veuillez indiquer vos années d'expérience.";
  }
  const num = parseInt(experience, 10);
  if (isNaN(num) || num < 0) {
    return "Veuillez entrer un nombre valide d'années d'expérience.";
  }
  return null;
};

export const validatePhoto = (file) => {
  if (!file) return null;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) return "Format invalide. Utilisez JPG, PNG ou WEBP.";
  if (file.size > 5 * 1024 * 1024) return "L'image ne doit pas dépasser 5MB.";
  return null;
};