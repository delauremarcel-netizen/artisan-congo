import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../middleware/verify-token.js';
import { verifyRole } from '../middleware/verify-role.js';

const router = express.Router();

const VALID_CATEGORIES = [
  'Électricien', 'Plombier', 'Menuisier', 'Maçon', 'Peintre',
  'Carreleur', 'Serrurier', 'Charpentier', 'Couvreur', 'Vitrier',
  'Chauffagiste', 'Climaticien', 'Électroménager', 'Informatique',
  'Téléphonie', 'Décorateur', 'Jardinier', 'Nettoyage', 'Réparation', 'Autre'
];

// GET /artisans/search
router.get('/search', async (req, res) => {
  const { categorie, ville } = req.query;

  logger.info('Artisan search request', { categorie, ville });

  const filters = ["statut = 'active'"];

  if (categorie) {
    filters.push(`categorie = '${categorie}'`);
  }

  if (ville) {
    filters.push(`ville = '${ville}'`);
  }

  const filterString = filters.join(' && ');

  logger.info('Search filter constructed', { filterString });

  const artisans = await pb.collection('artisans').getFullList({
    filter: filterString,
    sort: '-note',
  });

  logger.info('Artisans fetched', { count: artisans.length });

  const result = artisans.map((artisan) => {
    const photoUrl = artisan.photo
      ? pb.files.getUrl(artisan, artisan.photo)
      : null;

    return {
      id: artisan.id,
      userId: artisan.id,
      categorie: artisan.categorie || '',
      description: artisan.description || '',
      ville: artisan.ville || '',
      telephone: artisan.telephone || '',
      photo: photoUrl,
      note: artisan.note || 0,
      nombreAvis: artisan.nombreAvis || 0,
      dateInscription: artisan.created || '',
      statut: artisan.statut || 'active',
    };
  });

  res.json({
    success: true,
    data: result,
  });
});

// GET /artisans/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  logger.info('Artisan detail request', { artisanId: id });

  const artisan = await pb.collection('artisans').getOne(id);

  logger.info('Artisan fetched', { artisanId: id, artisanName: artisan.nom || artisan.name });

  // Fetch recent avis (last 5)
  const avisRecords = await pb.collection('avis').getList(1, 5, {
    filter: `artisan_id = "${id}"`,
    sort: '-created',
  });

  logger.info('Recent avis fetched', { artisanId: id, count: avisRecords.items.length });

  const photoUrl = artisan.photo
    ? pb.files.getUrl(artisan, artisan.photo)
    : null;

  const artisanData = {
    id: artisan.id,
    userId: artisan.id,
    categorie: artisan.categorie || '',
    description: artisan.description || '',
    ville: artisan.ville || '',
    telephone: artisan.telephone || '',
    photo: photoUrl,
    note: artisan.note || 0,
    nombreAvis: artisan.nombreAvis || 0,
    dateInscription: artisan.created || '',
    statut: artisan.statut || 'active',
  };

  const avisData = avisRecords.items.map((avis) => {
    // Fetch client name
    let clientName = 'Anonyme';
    if (avis.client_id) {
      try {
        const client = pb.collection('users').getOne(avis.client_id);
        clientName = client.name || client.email || 'Anonyme';
      } catch (error) {
        logger.warn('Failed to fetch client name', { clientId: avis.client_id });
      }
    }

    return {
      id: avis.id,
      demandeId: avis.demande_id,
      artisanId: avis.artisan_id,
      clientId: avis.client_id,
      clientName,
      note: avis.note,
      commentaire: avis.commentaire || '',
      dateCreation: avis.created,
    };
  });

  res.json({
    success: true,
    data: {
      artisan: artisanData,
      avis: avisData,
    },
  });
});

// GET /artisans/:id/demandes (auth: verifyToken, verifyRole('artisan'))
router.get('/:id/demandes', verifyToken, verifyRole('artisan'), async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  logger.info('Artisan demandes request', { artisanId: id, userId });

  // Verify userId matches artisan
  if (id !== userId) {
    logger.warn('Unauthorized demandes access attempt', { artisanId: id, userId });
    return res.status(403).json({
      error: 'Forbidden: You can only view your own demandes',
    });
  }

  const demandes = await pb.collection('demandes').getList(1, 100, {
    filter: `artisan_id = "${id}"`,
    sort: '-dateCreation',
  });

  logger.info('Demandes fetched', { artisanId: id, count: demandes.items.length });

  const result = demandes.items.map((demande) => ({
    id: demande.id,
    artisanId: demande.artisan_id,
    clientId: demande.client_id,
    categorie: demande.categorie,
    description: demande.description,
    ville: demande.ville,
    montantEstime: demande.montant_estime,
    statut: demande.statut,
    dateCreation: demande.dateCreation || demande.created,
    dateAcceptation: demande.dateAcceptation || null,
  }));

  res.json({
    success: true,
    data: result,
  });
});

// GET /artisans/:id/paiements (auth: verifyToken, verifyRole('artisan'))
router.get('/:id/paiements', verifyToken, verifyRole('artisan'), async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  logger.info('Artisan paiements request', { artisanId: id, userId });

  // Verify userId matches artisan
  if (id !== userId) {
    logger.warn('Unauthorized paiements access attempt', { artisanId: id, userId });
    return res.status(403).json({
      error: 'Forbidden: You can only view your own paiements',
    });
  }

  const paiements = await pb.collection('paiements').getList(1, 100, {
    filter: `artisan_id = "${id}"`,
    sort: '-dateCreation',
  });

  logger.info('Paiements fetched', { artisanId: id, count: paiements.items.length });

  const result = paiements.items.map((paiement) => ({
    id: paiement.id,
    demandeId: paiement.demande_id,
    artisanId: paiement.artisan_id,
    clientId: paiement.client_id,
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
  });
});

// GET /artisans/:id/avis
router.get('/:id/avis', async (req, res) => {
  const { id } = req.params;

  logger.info('Artisan avis request', { artisanId: id });

  const avis = await pb.collection('avis').getList(1, 100, {
    filter: `artisan_id = "${id}"`,
    sort: '-created',
  });

  logger.info('Avis fetched', { artisanId: id, count: avis.items.length });

  const result = avis.items.map((review) => {
    let clientName = 'Anonyme';
    if (review.client_id) {
      try {
        const client = pb.collection('users').getOne(review.client_id);
        clientName = client.name || client.email || 'Anonyme';
      } catch (error) {
        logger.warn('Failed to fetch client name', { clientId: review.client_id });
      }
    }

    return {
      id: review.id,
      demandeId: review.demande_id,
      artisanId: review.artisan_id,
      clientId: review.client_id,
      clientName,
      note: review.note,
      commentaire: review.commentaire || '',
      dateCreation: review.created,
    };
  });

  res.json({
    success: true,
    data: result,
  });
});

export default router;