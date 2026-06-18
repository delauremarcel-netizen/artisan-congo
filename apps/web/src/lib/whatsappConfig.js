export const PLATFORM_PHONE_NUMBER = "+33605884875";

// Generates a WhatsApp link specifically for the platform with a pre-filled message
export const getWhatsAppLink = (message) => {
  const cleanPhone = PLATFORM_PHONE_NUMBER.replace(/[\s\-\(\)]+/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

// Generates a generic WhatsApp link (used by Header/ArtisanSearch for dynamic numbers)
export const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone ? phone.replace(/[\s\-\(\)]+/g, '') : PLATFORM_PHONE_NUMBER.replace(/[\s\-\(\)]+/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

// Creates a formatted client inquiry message
export const generateClientMessage = (category, city, urgency = "dès que possible") => {
  return `Bonjour, je cherche un professionnel en ${category || 'services'} à ${city || 'votre ville'}. C'est pour une intervention ${urgency}. Pouvez-vous m'aider ?`;
};

// Alias for components currently using getClientToArtisanMessage
export const getClientToArtisanMessage = generateClientMessage;

// Creates a formatted artisan greeting message
export const generateArtisanMessage = (artisanName, category) => {
  return `Bonjour, je suis ${artisanName}, artisan spécialisé en ${category}. Comment puis-je vous aider ?`;
};

export const getGeneralContactMessage = () => {
  return "Bonjour ArtisanCongo, je souhaite avoir plus d'informations sur vos services.";
};

// --- NEW HELPERS FOR SIMPLIFIED SIGNUP ---

export const getSupportWhatsAppLink = () => {
  const message = "Bonjour, j'ai besoin d'aide pour m'inscrire sur Artisan Congo";
  return getWhatsAppLink(message);
};

export const getPostSignupWhatsAppLink = () => {
  const message = "Bonjour ArtisanCongo, je viens de m'inscrire en tant qu'artisan. Pouvez-vous finaliser mon profil ?";
  return getWhatsAppLink(message);
};