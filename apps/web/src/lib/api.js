
import apiServerClient from '@/lib/apiServerClient';

// Artisan endpoints
export async function fetchArtisans(metier = '', localisation = '') {
  const params = new URLSearchParams();
  if (metier) params.append('metier', metier);
  if (localisation) params.append('localisation', localisation);
  
  const response = await apiServerClient.fetch(`/artisans/search?${params.toString()}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des artisans');
  return await response.json();
}

export async function fetchArtisan(id) {
  const response = await apiServerClient.fetch(`/artisans/${id}`);
  if (!response.ok) throw new Error('Artisan introuvable');
  return await response.json();
}

export async function fetchArtisanDemandes(id) {
  const response = await apiServerClient.fetch(`/artisans/${id}/demandes`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des demandes');
  return await response.json();
}

export async function fetchArtisanPaiements(id) {
  const response = await apiServerClient.fetch(`/artisans/${id}/paiements`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des paiements');
  return await response.json();
}

export async function fetchArtisanAvis(id) {
  const response = await apiServerClient.fetch(`/artisans/${id}/avis`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des avis');
  return await response.json();
}

// Demande endpoints
export async function createDemande(artisanId, metier, description, localisation, montantEstime) {
  const response = await apiServerClient.fetch('/demandes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artisanId, metier, description, localisation, montantEstime })
  });
  if (!response.ok) throw new Error('Erreur lors de la création de la demande');
  return await response.json();
}

export async function accepterDemande(demandeId) {
  const response = await apiServerClient.fetch(`/demandes/${demandeId}/accepter`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Erreur lors de l\'acceptation de la demande');
  return await response.json();
}

export async function refuserDemande(demandeId) {
  const response = await apiServerClient.fetch(`/demandes/${demandeId}/refuser`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Erreur lors du refus de la demande');
  return await response.json();
}

export async function terminerDemande(demandeId) {
  const response = await apiServerClient.fetch(`/demandes/${demandeId}/terminer`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Erreur lors de la finalisation de la demande');
  return await response.json();
}

export async function fetchClientDemandes(clientId) {
  const response = await apiServerClient.fetch(`/clients/${clientId}/demandes`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des demandes');
  return await response.json();
}

// Paiement endpoints
export async function createPaiement(demandeId, montantTotal) {
  const response = await apiServerClient.fetch('/paiements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandeId, montantTotal })
  });
  if (!response.ok) throw new Error('Erreur lors de la création du paiement');
  return await response.json();
}

export async function confirmerPaiement(paiementId, numeroTransaction) {
  const response = await apiServerClient.fetch(`/paiements/${paiementId}/confirmer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeroTransaction })
  });
  if (!response.ok) throw new Error('Erreur lors de la confirmation du paiement');
  return await response.json();
}

export async function fetchClientPaiements(clientId) {
  const response = await apiServerClient.fetch(`/clients/${clientId}/paiements`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des paiements');
  return await response.json();
}

// Avis endpoints
export async function createAvis(demandeId, note, commentaire) {
  const response = await apiServerClient.fetch('/avis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandeId, note, commentaire })
  });
  if (!response.ok) throw new Error('Erreur lors de la création de l\'avis');
  return await response.json();
}

// Admin endpoints
export async function fetchAdminStats() {
  const response = await apiServerClient.fetch('/admin/stats');
  if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
  return await response.json();
}

export async function fetchAdminPaiements(statut = '', page = 1) {
  const params = new URLSearchParams();
  if (statut) params.append('statut', statut);
  params.append('page', page.toString());
  params.append('limit', '10');
  
  const response = await apiServerClient.fetch(`/admin/paiements?${params.toString()}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des paiements');
  return await response.json();
}

export async function fetchAdminArtisans(statut = '', page = 1) {
  const params = new URLSearchParams();
  if (statut) params.append('statut', statut);
  params.append('page', page.toString());
  params.append('limit', '10');
  
  const response = await apiServerClient.fetch(`/admin/artisans?${params.toString()}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des artisans');
  return await response.json();
}

export async function suspendreArtisan(artisanId) {
  const response = await apiServerClient.fetch(`/admin/artisans/${artisanId}/suspendre`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Erreur lors de la suspension de l\'artisan');
  return await response.json();
}

export async function activerArtisan(artisanId) {
  const response = await apiServerClient.fetch(`/admin/artisans/${artisanId}/activer`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Erreur lors de l\'activation de l\'artisan');
  return await response.json();
}
