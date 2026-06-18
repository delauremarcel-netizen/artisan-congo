import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { authenticateAdmin } from '../middleware/admin-auth.js';

const router = express.Router();

// POST /admin-auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields: email, password' });
  }

  logger.info('Admin login attempt', { email });

  // Authenticate with PocketBase admin_users collection
  const authData = await pb.collection('admin_users').authWithPassword(email, password);

  if (!authData || !authData.record) {
    throw new Error('Authentication failed');
  }

  // Verify user has admin role
  if (authData.record.role !== 'admin') {
    logger.warn('Login attempt by non-admin user', { email, role: authData.record.role });
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: authData.record.id,
      email: authData.record.email,
      role: authData.record.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  logger.info('Admin login successful', { email, userId: authData.record.id });

  res.json({
    success: true,
    token,
    admin: {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name || '',
      role: authData.record.role,
    },
  });
});

// GET /admin-auth/stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  logger.info('Admin stats request', { adminId: req.admin.id });

  // Fetch all artisans
  const artisans = await pb.collection('artisans').getFullList();
  const totalArtisans = artisans.length;

  // Fetch all demandes
  const demandes = await pb.collection('demandes').getFullList();
  const totalDemandes = demandes.length;

  // Calculate total revenue (5% commission on completed demandes)
  let totalRevenue = 0;
  demandes.forEach((demande) => {
    if (demande.statut === 'terminée' && demande.montant_estime) {
      const amount = parseFloat(demande.montant_estime) || 0;
      totalRevenue += amount * 0.05;
    }
  });

  // Count pending approvals (artisans with status 'pending')
  const pendingArtisans = artisans.filter((a) => a.statut === 'pending');
  const pendingApprovals = pendingArtisans.length;

  logger.info('Admin stats compiled', {
    totalArtisans,
    totalDemandes,
    totalRevenue,
    pendingApprovals,
  });

  res.json({
    success: true,
    data: {
      totalArtisans,
      totalDemandes,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingApprovals,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /admin-auth/notifications
router.get('/notifications', authenticateAdmin, async (req, res) => {
  logger.info('Admin notifications request', { adminId: req.admin.id });

  const { limit = 10 } = req.query;
  const fetchLimit = Math.min(parseInt(limit, 10) || 10, 100);

  const notifications = await pb.collection('notifications').getList(1, fetchLimit, {
    sort: '-created',
  });

  logger.info('Admin notifications fetched', {
    count: notifications.items.length,
    adminId: req.admin.id,
  });

  res.json({
    success: true,
    items: notifications.items.map((notif) => ({
      id: notif.id,
      title: notif.title || '',
      message: notif.message || '',
      type: notif.type || 'info',
      read: notif.read || false,
      created: notif.created,
    })),
    total: notifications.totalItems,
  });
});

export default router;