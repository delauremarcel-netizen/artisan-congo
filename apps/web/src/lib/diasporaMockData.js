// Shared mock data for Diaspora pages to ensure beautiful UI out-of-the-box
export const mockProjects = [
  {
    id: 'prj_1',
    name: 'Villa Familiale Brazzaville',
    location: 'Brazzaville, Poto-Poto',
    type: 'Construction',
    status: 'En cours',
    progress: 65,
    budget_initial: 45000,
    budget_spent: 32000,
    artisan_name: 'Koffi B.',
    next_step: 'Pose de la toiture',
    thumbnail: 'https://images.unsplash.com/photo-1608283833720-d887aa2d6d46',
    stages: [
      { name: 'Fondations', status: 'Complété', date: '2025-01-15' },
      { name: 'Murs', status: 'Complété', date: '2025-03-10' },
      { name: 'Toiture', status: 'En cours', date: '2025-04-20' },
      { name: 'Finitions', status: 'Planifié', date: '2025-06-01' }
    ]
  },
  {
    id: 'prj_2',
    name: 'Rénovation Appt Pointe-Noire',
    location: 'Pointe-Noire, Centre-ville',
    type: 'Rénovation',
    status: 'Terminé',
    progress: 100,
    budget_initial: 15000,
    budget_spent: 14800,
    artisan_name: 'Aminata T.',
    next_step: 'Livraison finale',
    thumbnail: 'https://images.unsplash.com/photo-1650018984119-8a3fa781fa19',
    stages: [
      { name: 'Démolition', status: 'Complété', date: '2024-11-05' },
      { name: 'Plomberie/Elec', status: 'Complété', date: '2024-11-20' },
      { name: 'Revêtements', status: 'Complété', date: '2024-12-10' },
      { name: 'Finitions', status: 'Complété', date: '2024-12-28' }
    ]
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: 'Jean-Baptiste L.',
    country: 'France',
    project: 'Construction Villa',
    quote: "Gérer la construction de ma maison à Brazzaville depuis Paris était un cauchemar avant. Avec Artisan Congo, je vois l'avancement chaque semaine. L'esprit tranquille.",
    image: 'https://images.unsplash.com/photo-1531973756702-a5c95e75113e'
  },
  {
    id: 2,
    name: 'Sarah M.',
    country: 'Canada',
    project: 'Rénovation Appartement',
    quote: "Le système de paiement par étapes sécurisé m'a convaincue. L'artisan n'est payé que lorsque je valide les photos de l'étape terminée. Brillant !",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
  },
  {
    id: 3,
    name: 'Marc O.',
    country: 'USA',
    project: 'Extension Maison',
    quote: "Une transparence totale sur les prix des matériaux. Mon budget a été respecté au centime près pour la première fois dans mes projets au pays.",
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f'
  }
];

export const mockExpenses = [
  { id: 1, date: '2025-04-12', desc: 'Achat Ciment (50 sacs)', amount: 450, category: 'Matériaux', status: 'Payé' },
  { id: 2, date: '2025-04-10', desc: 'Paiement Equipe (Semaine 3)', amount: 300, category: "Main-d'œuvre", status: 'Payé' },
  { id: 3, date: '2025-04-08', desc: 'Transport Sable', amount: 80, category: 'Transport', status: 'Payé' },
  { id: 4, date: '2025-04-01', desc: 'Achat Fer à béton', amount: 820, category: 'Matériaux', status: 'Payé' },
];