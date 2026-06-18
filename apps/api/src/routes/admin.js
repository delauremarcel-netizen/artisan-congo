import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../middleware/verify-token.js';
import { verifyRole } from '../middleware/verify-role.js';

const router = express.Router();

// GET /admin/stats (auth: verifyToken, verifyRole('admin'))
router.get('/stats', verifyToken, verifyRole('admin'), async (req, res) => {
  logger.info('Admin stats request', { adminId: req.userId });

  // Count artisans with statut='actif'
  const artisans = await pb.collection('artisans').getFullList({
    filter: 'statut = "actif"',
  });
  const nombreArtisans = artisans.length;

  // Count clients (users with role='client')
  const clients = await pb.collection('users').getFullList({
    filter: 'role = "client"',
  });
  const nombreClients = clients.length;

  // Count all demandes
  const demandes = await pb.collection('demandes').getFullList();
  const nombreDemandes = demandes.length;

  // Count paiements with statut='payé'
  const paiements = await pb.collection('paiements').getFullList({
    filter: 'statut = "payé"',
  });
  const nombrePaiements = paiements.length;

  // Sum montantCommission and montantArtisan for payé paiements
  let montantCommissions = 0;
  let montantArtisans = 0;
  paiements.forEach((paiement) => {
    montantCommissions += parseFloat(paiement.montant_commission) || 0;
    montantArtisans += parseFloat(paiement.montant_artisan) || 0;
  });

  logger.info('Admin stats compiled', {
    nombreArtisans,
    nombreClients,
    nombreDemandes,
    nombrePaiements,
    montantCommissions,
    montantArtisans,
  });

  res.json({
    success: true,
    data: {
      nombreArtisans,
      nombreClients,
      nombreDemandes,
      nombrePaiements,
      montantCommissions: Math.round(montantCommissions * 100) / 100,
      montantArtisans: Math.round(montantArtisans * 100) / 100,
    },
  });
});

// GET /admin/paiements (auth: verifyToken, verifyRole('admin'))
router.get('/paiements', verifyToken, verifyRole('admin'), async (req, res) => {
  const { statut, page = 1 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const perPage = 10;

  logger.info('Admin paiements request', { statut, page: pageNum });

  const filters = [];
  if (statut) {
    filters.push(`statut = "${statut}"`);
  }
  const filterString = filters.length > 0 ? filters.join(' && ') : undefined;

  const paiements = await pb.collection('paiements').getList(pageNum, perPage, {
    filter: filterString,
    sort: '-dateCreation',
  });

  logger.info('Paiements fetched', {
    count: paiements.items.length,
    total: paiements.totalItems,
    page: pageNum,
  });

  const result = paiements.items.map((paiement) => ({
    id: paiement.id,
    demandeId: paiement.demande_id,
    clientId: paiement.client_id,
    artisanId: paiement.artisan_id,
    montantTotal: paiement.montant_total,
    montantCommission: paiement.montant_commission,
    montantArtisan: paiement.montant_artisan,
    statut: paiement.statut,
    dateCreation: paiement.dateCreation || paiement.created,
    datePaiement: paiement.datePaiement || null,
  }));

  res.json({
    success: true,
    data: result,
    total: paiements.totalItems,
    page: pageNum,
    pages: Math.ceil(paiements.totalItems / perPage),
  });
});

// GET /admin/artisans (auth: verifyToken, verifyRole('admin'))
router.get('/artisans', verifyToken, verifyRole('admin'), async (req, res) => {
  const { statut, page = 1 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const perPage = 10;

  logger.info('Admin artisans request', { statut, page: pageNum });

  const filters = [];
  if (statut) {
    filters.push(`statut = "${statut}"`);
  }
  const filterString = filters.length > 0 ? filters.join(' && ') : undefined;

  const artisans = await pb.collection('artisans').getList(pageNum, perPage, {
    filter: filterString,
    sort: '-dateInscription',
  });

  logger.info('Artisans fetched', {
    count: artisans.items.length,
    total: artisans.totalItems,
    page: pageNum,
  });

  const result = artisans.items.map((artisan) => {
    const photoUrl = artisan.photo
      ? pb.files.getUrl(artisan, artisan.photo)
      : null;

    return {
      id: artisan.id,
      userId: artisan.id,
      metier: artisan.metier || '',
      description: artisan.description || '',
      localisation: artisan.localisation || '',
      avisNote: artisan.avisNote || 0,
      nombreAvis: artisan.nombreAvis || 0,
      statut: artisan.statut || 'actif',
      dateInscription: artisan.dateInscription || artisan.created,
      photo: photoUrl,
    };
  });

  res.json({
    success: true,
    data: result,
    total: artisans.totalItems,
    page: pageNum,
    pages: Math.ceil(artisans.totalItems / perPage),
  });
});

// PUT /admin/artisans/:id/suspendre (auth: verifyToken, verifyRole('admin'))
router.put('/artisans/:id/suspendre', verifyToken, verifyRole('admin'), async (req, res) => {
  const { id } = req.params;

  logger.info('Admin suspend artisan request', { artisanId: id });

  // Fetch artisan by ID
  const artisan = await pb.collection('artisans').getOne(id);

  // Update artisan statut to 'suspendu'
  const updatedArtisan = await pb.collection('artisans').update(id, {
    statut: 'suspendu',
  });

  logger.info('Artisan suspended successfully', { artisanId: id });

  const photoUrl = updatedArtisan.photo
    ? pb.files.getUrl(updatedArtisan, updatedArtisan.photo)
    : null;

  res.json({
    success: true,
    data: {
      id: updatedArtisan.id,
      userId: updatedArtisan.id,
      metier: updatedArtisan.metier || '',
      description: updatedArtisan.description || '',
      localisation: updatedArtisan.localisation || '',
      avisNote: updatedArtisan.avisNote || 0,
      nombreAvis: updatedArtisan.nombreAvis || 0,
      statut: updatedArtisan.statut,
      dateInscription: updatedArtisan.dateInscription || updatedArtisan.created,
      photo: photoUrl,
    },
  });
});

// PUT /admin/artisans/:id/activer (auth: verifyToken, verifyRole('admin'))
router.put('/artisans/:id/activer', verifyToken, verifyRole('admin'), async (req, res) => {
  const { id } = req.params;

  logger.info('Admin activate artisan request', { artisanId: id });

  // Fetch artisan by ID
  const artisan = await pb.collection('artisans').getOne(id);

  // Update artisan statut to 'actif'
  const updatedArtisan = await pb.collection('artisans').update(id, {
    statut: 'actif',
  });

  logger.info('Artisan activated successfully', { artisanId: id });

  const photoUrl = updatedArtisan.photo
    ? pb.files.getUrl(updatedArtisan, updatedArtisan.photo)
    : null;

  res.json({
    success: true,
    data: {
      id: updatedArtisan.id,
      userId: updatedArtisan.id,
      metier: updatedArtisan.metier || '',
      description: updatedArtisan.description || '',
      localisation: updatedArtisan.localisation || '',
      avisNote: updatedArtisan.avisNote || 0,
      nombreAvis: updatedArtisan.nombreAvis || 0,
      statut: updatedArtisan.statut,
      dateInscription: updatedArtisan.dateInscription || updatedArtisan.created,
      photo: photoUrl,
    },
  });
});

export default router;