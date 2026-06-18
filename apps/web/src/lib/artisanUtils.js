import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Calculate profile completion percentage based on filled fields
 * @param {Object} artisanProfile - The artisan profile object
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (artisanProfile) => {
  if (!artisanProfile) return 0;

  const fields = [
    artisanProfile.name,
    artisanProfile.bio,
    artisanProfile.category,
    artisanProfile.city,
    artisanProfile.charte_acceptee,
    artisanProfile.phone,
    artisanProfile.experience_years !== null && artisanProfile.experience_years !== undefined,
  ];

  const filledFields = fields.filter(field => {
    if (typeof field === 'boolean') return field === true;
    if (typeof field === 'string') return field && field.trim().length > 0;
    return field !== null && field !== undefined;
  }).length;

  return Math.round((filledFields / fields.length) * 100);
};

/**
 * Get color class based on score range
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind color class
 */
export const getScoreColor = (score) => {
  if (score === null || score === undefined) return 'text-muted-foreground';
  
  if (score < 40) return 'text-red-600 dark:text-red-400';
  if (score < 70) return 'text-orange-600 dark:text-orange-400';
  return 'text-green-600 dark:text-green-400';
};

/**
 * Get background color class based on score range
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind background color class
 */
export const getScoreBgColor = (score) => {
  if (score === null || score === undefined) return 'bg-muted';
  
  if (score < 40) return 'bg-red-100 dark:bg-red-900/20';
  if (score < 70) return 'bg-orange-100 dark:bg-orange-900/20';
  return 'bg-green-100 dark:bg-green-900/20';
};

/**
 * Format date to relative format (e.g., "il y a 2 jours")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted relative date
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: fr 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Get color for status badges (informel/verifie/certifie)
 * @param {string} status - Status value
 * @returns {string} Tailwind class string
 */
export const getStatusBadgeColor = (status) => {
  const statusMap = {
    'informel': 'status-informel',
    'verifie': 'status-verifie',
    'certifie': 'status-certifie',
  };
  
  return statusMap[status] || 'status-informel';
};

/**
 * Get color for artisan badges (debutant/verifie/premium/top/suspendu)
 * @param {string} badge - Badge value
 * @returns {string} Tailwind class string
 */
export const getBadgeColor = (badge) => {
  const badgeMap = {
    'debutant': 'badge-debutant',
    'verifie': 'badge-verifie',
    'premium': 'badge-premium',
    'top': 'badge-top',
    'suspendu': 'badge-suspendu',
  };
  
  return badgeMap[badge] || 'badge-debutant';
};

/**
 * Get display text for status
 * @param {string} status - Status value
 * @returns {string} Display text
 */
export const getStatusDisplayText = (status) => {
  const statusMap = {
    'informel': 'Informel',
    'verifie': 'Vérifié',
    'certifie': 'Certifié',
  };
  
  return statusMap[status] || status;
};

/**
 * Get display text for badge
 * @param {string} badge - Badge value
 * @returns {string} Display text
 */
export const getBadgeDisplayText = (badge) => {
  const badgeMap = {
    'debutant': 'Débutant',
    'verifie': 'Vérifié',
    'premium': 'Premium',
    'top': 'Top Artisan',
    'suspendu': 'Suspendu',
  };
  
  return badgeMap[badge] || badge;
};

/**
 * Get color for mission status
 * @param {string} status - Mission status
 * @returns {string} Tailwind class string
 */
export const getMissionStatusColor = (status) => {
  const statusMap = {
    'Nouveau': 'status-pending',
    'En cours': 'status-en-cours',
    'Terminé': 'status-termine',
    'Annulé': 'status-annule',
  };
  
  return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Render star rating as array of filled/empty stars
 * @param {number} rating - Rating value (0-5)
 * @returns {Array} Array of star states (true = filled, false = empty)
 */
export const getStarArray = (rating) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= roundedRating);
  }
  
  return stars;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};