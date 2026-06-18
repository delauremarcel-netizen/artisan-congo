export const validatePortfolioPhotos = (files) => {
  const maxFiles = 5;
  const maxSize = 20971520; // 20MB in bytes
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const errors = [];

  if (files.length > maxFiles) {
    errors.push('Vous avez atteint le maximum de 5 photos.');
  }

  const fileNames = new Set();

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      errors.push('Type de fichier non autorisé. Utilisez jpg, png, webp ou gif.');
    }
    if (file.size > maxSize) {
      errors.push('Ce fichier est trop volumineux (max 20MB)');
    }
    if (fileNames.has(file.name)) {
      // Avoid duplicate names to prevent issues
      errors.push(`Le fichier ${file.name} est en double.`);
    }
    fileNames.add(file.name);
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)] // Return unique errors
  };
};