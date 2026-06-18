import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { verifyToken } from '../middleware/verify-token.js';
import { verifyRole } from '../middleware/verify-role.js';

const router = express.Router();

// POST /avis (auth: verifyToken, verifyRole('client'))
router.post('/', verifyToken, verifyRole('client'), async (req, res) => {
  const { demandeId, note, commentaire } = req.body;
  const clientId = req.userId;

  logger.info('Review creation request', {
    demandeId,
    note,
    clientId,
  });

  // Validate required fields
  if (!demandeId || note === undefined || note === null) {
    return res.status(400).json({
      error: 'Missing required fields: demandeId, note',
    });
  }

  // Validate note is between 1 and 5
  const noteNum = parseFloat(note);
  if (isNaN(noteNum) || noteNum < 1 || noteNum > 5) {
    return res.status(400).json({
      error: 'note must be a number between 1 and 5',
    });
  }

  // Validate commentaire is non-empty
  if (!commentaire || commentaire.trim() === '') {
    return res.status(400).json({
      error: 'commentaire cannot be empty',
    });
  }

  // Fetch demande to verify client and get artisan_id
  const demande = await pb.collection('demandes').getOne(demandeId);

  // Verify client matches
  if (demande.client_id !== clientId) {
    logger.warn('Unauthorized review creation attempt', { demandeId, clientId });
    return res.status(403).json({
      error: 'Forbidden: You can only review demandes you created',
    });
  }

  // Verify statut is 'terminée'
  if (demande.statut !== 'terminée') {
    throw new Error(`Cannot create review for demande with status: ${demande.statut}`);
  }

  const artisanId = demande.artisan_id;

  logger.info('Demande fetched', { demandeId, artisanId });

  // Verify no existing avis for this demande
  const existingAvis = await pb.collection('avis').getList(1, 1, {
    filter: `demande_id = "${demandeId}"`,
  });

  if (existingAvis.items.length > 0) {
    throw new Error('An avis already exists for this demande');
  }

  // Create avis record
  const avis = await pb.collection('avis').create({
    demande_id: demandeId,
    artisan_id: artisanId,
    client_id: clientId,
    note: noteNum,
    commentaire: commentaire.trim(),
    dateCreation: new Date().toISOString(),
  });

  logger.info('Review created successfully', {
    avisId: avis.id,
    demandeId,
    artisanId,
  });

  // Fetch all reviews for this artisan to calculate new average
  const allAvis = await pb.collection('avis').getFullList({
    filter: `artisan_id = "${artisanId}"`,
  });

  logger.info('All reviews fetched for artisan', {
    artisanId,
    totalReviews: allAvis.length,
  });

  // Calculate average rating
  const totalNotes = allAvis.reduce((sum, review) => sum + (parseFloat(review.note) || 0), 0);
  const averageNote = allAvis.length > 0 ? totalNotes / allAvis.length : 0;

  logger.info('Average rating calculated', {
    artisanId,
    averageNote,
    totalReviews: allAvis.length,
  });

  // Update artisan's avisNote and nombreAvis
  await pb.collection('artisans').update(artisanId, {
    avisNote: averageNote,
    nombreAvis: allAvis.length,
  });

  logger.info('Artisan updated with new rating', {
    artisanId,
    avisNote: averageNote,
    nombreAvis: allAvis.length,
  });

  res.status(201).json({
    success: true,
    data: {
      id: avis.id,
      demandeId: avis.demande_id,
      artisanId: avis.artisan_id,
      clientId: avis.client_id,
      note: avis.note,
      commentaire: avis.commentaire,
      dateCreation: avis.dateCreation,
    },
  });
});

export default router;