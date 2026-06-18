import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { authenticateAdmin } from '../middleware/admin-auth.js';

const router = express.Router();

// Apply admin auth middleware to all routes
router.use(authenticateAdmin);

// GET /admin/stats - Returns admin dashboard statistics
router.get('/stats', async (req, res) => {
  logger.info('Admin stats request received', {
    adminId: req.admin.id,
  });

  try {
    const artisans = await pb.collection('artisans').getFullList();
    const demandes = await pb.collection('demandes').getFullList();
    const paiements = await pb.collection('paiements').getFullList();

    let totalPaiements = 0;
    paiements.forEach((paiement) => {
      totalPaiements += parseFloat(paiement.montant_total) || 0;
    });

    res.json({
      success: true,
      data: {
        artisans: { total: artisans.length },
        demandes: { total: demandes.length },
        paiements: { total: totalPaiements, count: paiements.length },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    throw error;
  }
});

// GET /admin/notifications - Returns admin notifications list
router.get('/notifications', authenticateAdmin, async (req, res) => {
  try {
    const { read, limit } = req.query;
    const fetchLimit = parseInt(limit, 10) || 10;
    
    let filter = '';
    if (read === 'false') {
      filter = 'read = false';
    } else if (read === 'true') {
      filter = 'read = true';
    }

    const notifications = await pb.collection('notifications').getList(1, fetchLimit, {
      filter: filter || undefined,
      sort: '-created'
    });

    return res.json({ items: notifications.items });
  } catch (error) {
    logger.error('Error fetching admin notifications:', error);
    throw error;
  }
});

export default router;