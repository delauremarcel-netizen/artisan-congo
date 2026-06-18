import { PLATFORM_PHONE_NUMBER } from '@/lib/whatsappConfig.js';

/**
 * Generates a formatted WhatsApp link for the service qualification flow.
 * @param {string} serviceType - The selected service type (e.g., "Plomberie")
 * @param {string} location - The selected location (e.g., "Brazzaville")
 * @param {string} userDescription - The user's description of their need
 * @returns {string} The full WhatsApp wa.me URL with pre-filled message
 */
export const generateWhatsAppQualificationLink = (serviceType, location, userDescription) => {
  // Construct a clear, formatted message with line breaks for readability
  const message = `Bonjour, j'ai besoin d'un service :\n\nService : ${serviceType}\nLocalisation : ${location}\nBesoin : ${userDescription}`;
  
  // Clean phone number (remove any spaces, plus signs, or non-digits except the leading +)
  const cleanPhone = (PLATFORM_PHONE_NUMBER || '+33605884875').replace(/[^\d+]/g, '').replace(/^\+/, '');
  
  // URL-encode the message and return the complete wa.me link
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates a formatted WhatsApp link for FAQ inquiries.
 * @param {string} question - The FAQ question being asked
 * @returns {string} The full WhatsApp wa.me URL with pre-filled message
 */
export const generateWhatsAppFAQLink = (question) => {
  const message = `Bonjour, j'ai une question :\n${question}`;
  const cleanPhone = (PLATFORM_PHONE_NUMBER || '+33605884875').replace(/[^\d+]/g, '').replace(/^\+/, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates a formatted WhatsApp link based on the chatbot interaction mode.
 * Supports multiple modes: faq, service, artisan
 * @param {string} mode - Interaction mode ('faq', 'service', 'artisan')
 * @param {Object|string} data - The collected data or question string
 * @returns {string} The full WhatsApp wa.me URL with pre-filled message
 */
export const generateWhatsAppLink = (mode, data) => {
  const cleanPhone = (PLATFORM_PHONE_NUMBER || '+33605884875').replace(/[^\d+]/g, '').replace(/^\+/, '');
  let message = '';

  if (mode === 'faq') {
    // data is the question string
    message = `Bonjour, j'ai une question :\n${data}`;
  } else if (mode === 'service') {
    // data is { service, location, description }
    message = `Bonjour, j'ai un besoin :\nService : ${data.service}\nLocalisation : ${data.location}\nDescription : ${data.description}`;
  } else if (mode === 'artisan') {
    // data is { metier, location, bio, phone }
    message = `Bonjour, je veux m'inscrire comme artisan :\nMétier : ${data.metier}\nLocalisation : ${data.location}\nExpérience : ${data.bio}\nTéléphone : ${data.phone || 'Non précisé'}`;
  } else {
    message = "Bonjour ArtisanCongo, j'ai besoin d'aide.";
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};