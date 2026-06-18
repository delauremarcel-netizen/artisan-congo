
export function formatMontant(montant) {
  if (!montant && montant !== 0) return '0 XAF';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant).replace(/\s/g, ' ') + ' XAF';
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('fr-FR', options);
}

export function formatNote(note) {
  if (!note && note !== 0) return 'Pas de note';
  const fullStars = Math.floor(note);
  const emptyStars = 5 - fullStars;
  const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  return `${stars} (${note}/5)`;
}

export function calculCommission(montant) {
  return montant * 0.20;
}

export function calculMontantArtisan(montant) {
  return montant * 0.80;
}
