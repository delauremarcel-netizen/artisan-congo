/**
 * Utility functions for client interface (search, filtering, forms)
 */

export const filterArtisans = (artisans, filters) => {
  if (!artisans || !Array.isArray(artisans)) return [];
  
  return artisans.filter(artisan => {
    // Category Filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(artisan.category)) return false;
    }
    
    // Location Filter
    if (filters.locations && filters.locations.length > 0) {
      if (!filters.locations.includes(artisan.city)) return false;
    }
    
    // Score Filter
    if (filters.minScore > 0) {
      if ((artisan.score_global || 0) < filters.minScore) return false;
    }
    
    // Status Filter
    if (filters.status && filters.status !== 'all') {
      if (artisan.statut_artisan !== filters.status) return false;
    }
    
    // Badge Filter
    if (filters.badges && filters.badges.length > 0) {
      if (!filters.badges.includes(artisan.badge)) return false;
    }
    
    return true;
  });
};

export const sortArtisans = (artisans, sortBy) => {
  if (!artisans || !Array.isArray(artisans)) return [];
  const sorted = [...artisans];
  
  switch (sortBy) {
    case 'score_desc':
      return sorted.sort((a, b) => (b.score_global || 0) - (a.score_global || 0));
    case 'rating_desc':
      return sorted.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
    case 'missions_desc':
      return sorted.sort((a, b) => (b.missions_count || 0) - (a.missions_count || 0));
    case 'name_asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'recent_active':
      return sorted.sort((a, b) => new Date(b.last_activity || 0) - new Date(a.last_activity || 0));
    default:
      return sorted;
  }
};

export const searchArtisans = (artisans, searchTerm) => {
  if (!artisans || !Array.isArray(artisans) || !searchTerm) return artisans;
  
  const term = searchTerm.toLowerCase().trim();
  
  return artisans.filter(artisan => {
    const nameMatch = (artisan.name || '').toLowerCase().includes(term);
    const categoryMatch = (artisan.category || '').toLowerCase().includes(term);
    const cityMatch = (artisan.city || '').toLowerCase().includes(term);
    const bioMatch = (artisan.bio || '').toLowerCase().includes(term);
    
    return nameMatch || categoryMatch || cityMatch || bioMatch;
  });
};

export const validateMissionForm = (formData) => {
  const errors = {};
  let valid = true;

  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Le titre est requis';
    valid = false;
  } else if (formData.title.length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères';
    valid = false;
  }

  if (!formData.description || formData.description.trim() === '') {
    errors.description = 'La description est requise';
    valid = false;
  } else if (formData.description.length > 1000) {
    errors.description = 'La description ne peut pas dépasser 1000 caractères';
    valid = false;
  }

  if (!formData.category) {
    errors.category = 'La catégorie est requise';
    valid = false;
  }

  if (!formData.location || formData.location.trim() === '') {
    errors.location = 'La localisation est requise';
    valid = false;
  }

  if (!formData.start_date) {
    errors.start_date = 'La date de début est requise';
    valid = false;
  }

  if (formData.start_date && formData.end_date) {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end < start) {
      errors.end_date = 'La date de fin doit être ultérieure à la date de début';
      valid = false;
    }
  }

  if (formData.budget && parseFloat(formData.budget) < 0) {
    errors.budget = 'Le budget doit être positif';
    valid = false;
  }

  return { valid, errors };
};

export const validateReviewForm = (formData) => {
  const errors = {};
  let valid = true;

  if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
    errors.rating = 'Veuillez sélectionner une note globale';
    valid = false;
  }

  if (formData.review_text && formData.review_text.length > 500) {
    errors.review_text = 'Le commentaire ne peut pas dépasser 500 caractères';
    valid = false;
  }

  return { valid, errors };
};