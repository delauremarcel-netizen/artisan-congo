import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../middleware/verify-token.js';
import { verifyRole } from '../middleware/verify-role.js';

const router = express.Router();

// POST /paiements (auth: verifyToken, verifyRole('client'))
router.post('/', verifyToken, verifyRole('client'), async (req, res) => {
  const { demandeId, montantTotal } = req.body;
  const clientId = req.userId;

  logger.info('Payment creation request', {
    demandeId,
    montantTotal,
    clientId,
  });

  // Validate required fields
  if (!demandeId || !montantTotal) {
    return res.status(400).json({
      error: 'Missing required fields: demandeId, montantTotal',
    });
  }

  // Validate montantTotal > 0
  const montantNum = parseFloat(montantTotal);
  if (isNaN(montantNum) || montantNum <= 0) {
    return res.status(400).json({
      error: 'montantTotal must be a number greater than 0',
    });
  }

  // Fetch demande by ID
  const demande = await pb.collection('demandes').getOne(demandeId);

  // Verify clientId matches
  if (demande.client_id !== clientId) {
    logger.warn('Unauthorized payment creation attempt', { demandeId, clientId });
    return res.status(403).json({
      error: 'Forbidden: You can only create payments for your own demandes',
    });
  }

  // Verify statut is 'acceptée'
  if (demande.statut !== 'acceptée') {
    throw new Error(`Cannot create payment for demande with status: ${demande.statut}`);
  }

  // Calculate commission (20%) and artisan amount (80%)
  const montantCommission = montantNum * 0.20;
  const montantArtisan = montantNum * 0.80;

  logger.info('Payment amounts calculated', {
    montantTotal: montantNum,
    montantCommission,
    montantArtisan,
  });

  // Create paiement record
  const paiement = await pb.collection('paiements').create({
    demande_id: demandeId,
    artisan_id: demande.artisan_id,
    client_id: clientId,
    montant_total: montantNum,
    montant_commission: montantCommission,
    montant_artisan: montantArtisan,
    statut: 'en attente',
    methodePaiement: 'Mobile Money',
    dateCreation: new Date().toISOString(),
  });

  logger.info('Payment created successfully', {
    paiementId: paiement.id,
    demandeId,
    clientId,
  });

  // Update demande statut to 'en cours'
  await pb.collection('demandes').update(demandeId, {
    statut: 'en cours',
  });

  logger.info('Demande status updated to en cours', { demandeId });

  res.status(201).json({
    success: true,
    data: {
      id: paiement.id,
      demandeId: paiement.demande_id,
      artisanId: paiement.artisan_id,
      clientId: paiement.client_id,
      montantTotal: paiement.montant_total,
      montantCommission: paiement.montant_commission,
      montantArtisan: paiement.montant_artisan,
      statut: paiement.statut,
      methodePaiement: paiement.methodePaiement,
      dateCreation: paiement.dateCreation,
    },
    instructions: 'Envoyez le montant total via Mobile Money au +242 05 62 06 747',
  });
});

// PUT /paiements/:id/confirmer (auth: verifyToken, verifyRole('client'))
router.put('/:id/confirmer', verifyToken, verifyRole('client'), async (req, res) => {
  const { id } = req.params;
  const { numeroTransaction } = req.body;
  const clientId = req.userId;

  logger.info('Payment confirmation request', {
    paiementId: id,
    clientId,
  });

  // Validate numeroTransaction
  if (!numeroTransaction || numeroTransaction.trim() === '') {
    return res.status(400).json({
      error: 'Missing required field: numeroTransaction',
    });
  }

  // Fetch paiement
  const paiement = await pb.collection('paiements').getOne(id);

  // Verify client matches
  if (paiement.client_id !== clientId) {
    logger.warn('Unauthorized payment confirmation attempt', { paiementId: id, clientId });
    return res.status(403).json({
      error: 'Forbidden: You can only confirm your own payments',
    });
  }

  // Verify statut is 'en attente'
  if (paiement.statut !== 'en attente') {
    throw new Error(`Cannot confirm payment with status: ${paiement.statut}`);
  }

  // Update paiement
  const datePaiement = new Date();
  const updatedPaiement = await pb.collection('paiements').update(id, {
    statut: 'payé',
    datePaiement: datePaiement.toISOString(),
    numeroTransaction: numeroTransaction.trim(),
  });

  logger.info('Payment confirmed successfully', {
    paiementId: id,
    clientId,
  });

  res.json({
    success: true,
    data: {
      id: updatedPaiement.id,
      demandeId: updatedPaiement.demande_id,
      artisanId: updatedPaiement.artisan_id,
      clientId: updatedPaiement.client_id,
      montantTotal: updatedPaiement.montant_total,
      montantCommission: updatedPaiement.montant_commission,
      montantArtisan: updatedPaiement.montant_artisan,
      statut: updatedPaiement.statut,
      methodePaiement: updatedPaiement.methodePaiement,
      datePaiement: updatedPaiement.datePaiement,
      numeroTransaction: updatedPaiement.numeroTransaction,
      dateCreation: updatedPaiement.dateCreation,
    },
  });
});

// GET /paiements/clients/:id (auth: verifyToken, verifyRole('client'))
router.get('/clients/:id', verifyToken, verifyRole('client'), async (req, res) => {
  const { id } = req.params;
  const clientId = req.userId;

  logger.info('Client paiements request', { clientId, requestedId: id });

  // Verify client can only see their own paiements
  if (id !== clientId) {
    logger.warn('Unauthorized paiements access attempt', { clientId, requestedId: id });
    return res.status(403).json({
      error: 'Forbidden: You can only view your own payments',
    });
  }

  const paiements = await pb.collection('paiements').getList(1, 100, {
    filter: `client_id = "${id}"`,
    sort: '-dateCreation',
  });

  logger.info('Paiements fetched', { clientId: id, count: paiements.items.length });

  const result = paiements.items.map((paiement) => ({
    id: paiement.id,
    demandeId: paiement.demande_id,
    artisanId: paiement.artisan_id,
    clientId: paiement.client_id,
    montantTotal: paiement.montant_total,
    montantCommission: paiement.montant_commission,
    montantArtisan: paiement.montant_artisan,
    statut: paiement.statut,
    methodePaiement: paiement.methodePaiement,
    dateCreation: paiement.dateCreation || paiement.created,
    datePaiement: paiement.datePaiement || null,
  }));

  res.json({
    success: true,
    data: result,
  });
});

export default router;