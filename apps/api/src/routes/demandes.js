import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../middleware/verify-token.js';
import { verifyRole } from '../middleware/verify-role.js';

const router = express.Router();

const VALID_METIERS = [
  'Électricien', 'Plombier', 'Menuisier', 'Maçon', 'Peintre',
  'Carreleur', 'Serrurier', 'Charpentier', 'Couvreur', 'Vitrier',
  'Chauffagiste', 'Climaticien', 'Électroménager', 'Informatique',
  'Téléphonie', 'Décorateur', 'Jardinier', 'Nettoyage', 'Réparation', 'Autre'
];

// POST /demandes (auth: verifyToken, verifyRole('client'))
router.post('/', verifyToken, verifyRole('client'), async (req, res) => {
  const { artisanId, metier, description, localisation, montantEstime } = req.body;
  const clientId = req.userId;

  logger.info('Demande creation request', {
    artisanId,
    metier,
    localisation,
    montantEstime,
    clientId,
  });

  // Validate required fields
  if (!artisanId || !metier || !description || !localisation || !montantEstime) {
    return res.status(400).json({
      error: 'Missing required fields: artisanId, metier, description, localisation, montantEstime',
    });
  }

  // Validate montantEstime > 0
  const montantNum = parseFloat(montantEstime);
  if (isNaN(montantNum) || montantNum <= 0) {
    return res.status(400).json({
      error: 'montantEstime must be a number greater than 0',
    });
  }

  // Validate metier is in valid list
  if (!VALID_METIERS.includes(metier)) {
    return res.status(400).json({
      error: `Invalid metier. Valid categories: ${VALID_METIERS.join(', ')}`,
    });
  }

  // Validate localisation is non-empty
  if (!localisation || localisation.trim() === '') {
    return res.status(400).json({
      error: 'localisation cannot be empty',
    });
  }

  // Validate description is non-empty
  if (!description || description.trim() === '') {
    return res.status(400).json({
      error: 'description cannot be empty',
    });
  }

  // Calculate expiration date (7 days from now)
  const dateCreation = new Date();
  const dateExpiration = new Date(dateCreation.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Create demande record
  const demande = await pb.collection('demandes').create({
    artisan_id: artisanId,
    client_id: clientId,
    metier,
    description,
    localisation,
    montant_estime: montantNum,
    statut: 'en attente',
    dateCreation: dateCreation.toISOString(),
    dateExpiration: dateExpiration.toISOString(),
  });

  logger.info('Demande created successfully', {
    demandeId: demande.id,
    artisanId,
    clientId,
  });

  res.status(201).json({
    success: true,
    data: {
      id: demande.id,
      artisanId: demande.artisan_id,
      clientId: demande.client_id,
      metier: demande.metier,
      description: demande.description,
      localisation: demande.localisation,
      montantEstime: demande.montant_estime,
      statut: demande.statut,
      dateCreation: demande.dateCreation,
      dateExpiration: demande.dateExpiration,
    },
  });
});

// PUT /demandes/:id/accepter (auth: verifyToken, verifyRole('artisan'))
router.put('/:id/accepter', verifyToken, verifyRole('artisan'), async (req, res) => {
  const { id } = req.params;
  const artisanId = req.userId;

  logger.info('Demande accepter request', { demandeId: id, artisanId });

  // Fetch demande
  const demande = await pb.collection('demandes').getOne(id);

  // Verify artisan matches
  if (demande.artisan_id !== artisanId) {
    logger.warn('Unauthorized demande acceptance attempt', { demandeId: id, artisanId });
    return res.status(403).json({
      error: 'Forbidden: You can only accept your own demandes',
    });
  }

  // Verify statut is 'en attente'
  if (demande.statut !== 'en attente') {
    throw new Error(`Cannot accept demande with status: ${demande.statut}`);
  }

  // Update demande
  const dateAcceptation = new Date();
  const updatedDemande = await pb.collection('demandes').update(id, {
    statut: 'acceptée',
    dateAcceptation: dateAcceptation.toISOString(),
  });

  logger.info('Demande accepted successfully', {
    demandeId: id,
    artisanId,
  });

  res.json({
    success: true,
    data: {
      id: updatedDemande.id,
      artisanId: updatedDemande.artisan_id,
      clientId: updatedDemande.client_id,
      metier: updatedDemande.metier,
      description: updatedDemande.description,
      localisation: updatedDemande.localisation,
      montantEstime: updatedDemande.montant_estime,
      statut: updatedDemande.statut,
      dateCreation: updatedDemande.dateCreation,
      dateExpiration: updatedDemande.dateExpiration,
      dateAcceptation: updatedDemande.dateAcceptation,
    },
  });
});

// PUT /demandes/:id/refuser (auth: verifyToken, verifyRole('artisan'))
router.put('/:id/refuser', verifyToken, verifyRole('artisan'), async (req, res) => {
  const { id } = req.params;
  const artisanId = req.userId;

  logger.info('Demande refuser request', { demandeId: id, artisanId });

  // Fetch demande
  const demande = await pb.collection('demandes').getOne(id);

  // Verify artisan matches
  if (demande.artisan_id !== artisanId) {
    logger.warn('Unauthorized demande refusal attempt', { demandeId: id, artisanId });
    return res.status(403).json({
      error: 'Forbidden: You can only refuse your own demandes',
    });
  }

  // Verify statut is 'en attente'
  if (demande.statut !== 'en attente') {
    throw new Error(`Cannot refuse demande with status: ${demande.statut}`);
  }

  // Update demande
  const updatedDemande = await pb.collection('demandes').update(id, {
    statut: 'refusée',
  });

  logger.info('Demande refused successfully', {
    demandeId: id,
    artisanId,
  });

  res.json({
    success: true,
    data: {
      id: updatedDemande.id,
      artisanId: updatedDemande.artisan_id,
      clientId: updatedDemande.client_id,
      metier: updatedDemande.metier,
      description: updatedDemande.description,
      localisation: updatedDemande.localisation,
      montantEstime: updatedDemande.montant_estime,
      statut: updatedDemande.statut,
      dateCreation: updatedDemande.dateCreation,
      dateExpiration: updatedDemande.dateExpiration,
    },
  });
});

// PUT /demandes/:id/terminer (auth: verifyToken, verifyRole('artisan'))
router.put('/:id/terminer', verifyToken, verifyRole('artisan'), async (req, res) => {
  const { id } = req.params;
  const artisanId = req.userId;

  logger.info('Demande terminer request', { demandeId: id, artisanId });

  // Fetch demande
  const demande = await pb.collection('demandes').getOne(id);

  // Verify artisan matches
  if (demande.artisan_id !== artisanId) {
    logger.warn('Unauthorized demande termination attempt', { demandeId: id, artisanId });
    return res.status(403).json({
      error: 'Forbidden: You can only terminate your own demandes',
    });
  }

  // Verify statut is 'en cours'
  if (demande.statut !== 'en cours') {
    throw new Error(`Cannot terminate demande with status: ${demande.statut}`);
  }

  // Update demande
  const dateTerminaison = new Date();
  const updatedDemande = await pb.collection('demandes').update(id, {
    statut: 'terminée',
    dateTerminaison: dateTerminaison.toISOString(),
  });

  logger.info('Demande terminated successfully', {
    demandeId: id,
    artisanId,
  });

  res.json({
    success: true,
    data: {
      id: updatedDemande.id,
      artisanId: updatedDemande.artisan_id,
      clientId: updatedDemande.client_id,
      metier: updatedDemande.metier,
      description: updatedDemande.description,
      localisation: updatedDemande.localisation,
      montantEstime: updatedDemande.montant_estime,
      statut: updatedDemande.statut,
      dateCreation: updatedDemande.dateCreation,
      dateExpiration: updatedDemande.dateExpiration,
      dateTerminaison: updatedDemande.dateTerminaison,
    },
  });
});

// GET /demandes/clients/:id (auth: verifyToken, verifyRole('client'))
router.get('/clients/:id', verifyToken, verifyRole('client'), async (req, res) => {
  const { id } = req.params;
  const clientId = req.userId;

  logger.info('Client demandes request', { clientId, requestedId: id });

  // Verify client can only see their own demandes
  if (id !== clientId) {
    logger.warn('Unauthorized demandes access attempt', { clientId, requestedId: id });
    return res.status(403).json({
      error: 'Forbidden: You can only view your own demandes',
    });
  }

  const demandes = await pb.collection('demandes').getList(1, 100, {
    filter: `client_id = "${id}"`,
    sort: '-dateCreation',
  });

  logger.info('Demandes fetched', { clientId: id, count: demandes.items.length });

  const result = demandes.items.map((demande) => ({
    id: demande.id,
    artisanId: demande.artisan_id,
    clientId: demande.client_id,
    metier: demande.metier,
    description: demande.description,
    localisation: demande.localisation,
    montantEstime: demande.montant_estime,
    statut: demande.statut,
    dateCreation: demande.dateCreation || demande.created,
    dateAcceptation: demande.dateAcceptation || null,
    dateTerminaison: demande.dateTerminaison || null,
  }));

  res.json({
    success: true,
    data: result,
  });
});

export default router;