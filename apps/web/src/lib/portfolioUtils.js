import { format, differenceInMonths, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const validateProjectForm = (formData, isEdit = false, existingImagesCount = 0) => {
  const errors = {};
  let valid = true;

  if (!formData.titre || formData.titre.trim() === '') {
    errors.titre = 'Le titre est requis';
    valid = false;
  } else if (formData.titre.length > 100) {
    errors.titre = 'Le titre ne peut pas dépasser 100 caractères';
    valid = false;
  }

  if (!formData.description || formData.description.trim() === '') {
    errors.description = 'La description est requise';
    valid = false;
  } else if (formData.description.length > 1000) {
    errors.description = 'La description ne peut pas dépasser 1000 caractères';
    valid = false;
  }

  if (!formData.categorie) {
    errors.categorie = 'La catégorie est requise';
    valid = false;
  }

  const totalImages = (formData.newImages?.length || 0) + existingImagesCount;
  if (totalImages < 1) {
    errors.images = 'Au moins une image est requise';
    valid = false;
  } else if (totalImages > 10) {
    errors.images = 'Maximum 10 images autorisées';
    valid = false;
  }

  if (formData.newImages?.length > 0) {
    const oversizeFiles = formData.newImages.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizeFiles.length > 0) {
      errors.images = 'Chaque image doit faire moins de 5MB';
      valid = false;
    }
  }

  if (!formData.date_debut) {
    errors.date_debut = 'La date de début est requise';
    valid = false;
  }

  if (!formData.date_fin) {
    errors.date_fin = 'La date de fin est requise';
    valid = false;
  }

  if (formData.date_debut && formData.date_fin) {
    const start = new Date(formData.date_debut);
    const end = new Date(formData.date_fin);
    if (end < start) {
      errors.date_fin = 'La date de fin doit être ultérieure à la date de début';
      valid = false;
    }
  }

  if (formData.client_avis && formData.client_avis.length > 500) {
    errors.client_avis = 'L\'avis client ne peut pas dépasser 500 caractères';
    valid = false;
  }

  return { valid, errors };
};

export const formatProjectDate = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = format(start, 'MMM yyyy', { locale: fr });
  const endStr = format(end, 'MMM yyyy', { locale: fr });
  
  if (startStr === endStr) return startStr;
  return `${startStr} - ${endStr}`;
};

export const calculateProjectDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const months = differenceInMonths(end, start);
  if (months > 0) {
    return `${months} mois`;
  }
  
  const days = differenceInDays(end, start);
  return `${days} jours`;
};

export const getProjectStats = (projects = []) => {
  if (!projects || projects.length === 0) {
    return { totalViews: 0, averageRating: 0, totalProjects: 0, publicProjects: 0, draftProjects: 0 };
  }

  const totalProjects = projects.length;
  const publicProjects = projects.filter(p => p.statut === 'public').length;
  const draftProjects = projects.filter(p => p.statut === 'draft').length;
  
  const totalViews = projects.reduce((acc, p) => acc + (p.views_count || 0), 0);
  
  const ratedProjects = projects.filter(p => p.client_rating > 0);
  const averageRating = ratedProjects.length > 0 
    ? (ratedProjects.reduce((acc, p) => acc + p.client_rating, 0) / ratedProjects.length).toFixed(1)
    : 0;

  return { totalViews, averageRating, totalProjects, publicProjects, draftProjects };
};

export const sortProjects = (projects, sortBy) => {
  if (!projects || !Array.isArray(projects)) return [];
  const sorted = [...projects];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.created) - new Date(a.created));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created) - new Date(b.created));
    case 'views':
      return sorted.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    case 'rating':
      return sorted.sort((a, b) => (b.client_rating || 0) - (a.client_rating || 0));
    default:
      return sorted;
  }
};

export const filterProjectsByCategory = (projects, category) => {
  if (!projects || !Array.isArray(projects)) return [];
  if (!category || category === 'all') return projects;
  return projects.filter(p => p.categorie === category);
};