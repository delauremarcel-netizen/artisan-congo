import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { pocketbaseAuth } from '../middleware/pocketbase-auth.js';

const router = express.Router();

// Apply PocketBase auth middleware to all routes
router.use(pocketbaseAuth);

// GET /clients/:id/demandes
router.get('/:id/demandes', async (req, res) => {
  const { id } = req.params;
  const clientId = req.pocketbaseUserId;

  logger.info('Client demandes request', { clientId, requestedId: id });

  // Verify client can only see their own demandes
  if (id !== clientId) {
    return res.status(403).json({
      error: 'Forbidden: You can only view your own demandes',
    });
  }

  const demandes = await pb.collection('demandes').getList(1, 100, {
    filter: `client_id = "${id}"`,
    sort: '-created_at',
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
    dateCreation: demande.date_creation,
    dateExpiration: demande.date_expiration,
    dateAcceptation: demande.date_acceptation,
    createdAt: demande.created_at,
  }));

  res.json(result);
});

// GET /clients/:id/paiements
router.get('/:id/paiements', async (req, res) => {
  const { id } = req.params;
  const clientId = req.pocketbaseUserId;

  logger.info('Client paiements request', { clientId, requestedId: id });

  // Verify client can only see their own paiements
  if (id !== clientId) {
    return res.status(403).json({
      error: 'Forbidden: You can only view your own payments',
    });
  }

  const paiements = await pb.collection('paiements').getList(1, 100, {
    filter: `client_id = "${id}"`,
    sort: '-created_at',
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
    methodePaiement: paiement.methode_paiement,
    datePaiement: paiement.date_paiement,
    numeroTransaction: paiement.numero_transaction,
    createdAt: paiement.created_at,
  }));

  res.json(result);
});

export default router;