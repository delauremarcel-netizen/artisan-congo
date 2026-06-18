import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /analytics/summary
router.get('/summary', async (req, res) => {
  logger.info('Analytics summary request received');

  // Query leads collection
  let leadsResponse = [];
  let totalLeads = 0;
  let leadsByStatus = {};
  let leadsByCategory = {};

  try {
    leadsResponse = await pb.collection('leads').getFullList();
    totalLeads = leadsResponse.length;

    // Count leads by status
    leadsResponse.forEach((lead) => {
      const status = lead.status || 'unknown';
      leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
    });

    // Count leads by category
    leadsResponse.forEach((lead) => {
      const category = lead.category || 'unknown';
      leadsByCategory[category] = (leadsByCategory[category] || 0) + 1;
    });

    logger.info('Leads data aggregated', {
      totalLeads,
      statusCount: Object.keys(leadsByStatus).length,
      categoryCount: Object.keys(leadsByCategory).length,
    });
  } catch (error) {
    logger.warn('leads collection not found or empty:', error.message);
  }

  // Query whatsapp_clicks collection
  let totalWhatsAppClicks = 0;
  try {
    const whatsappClicksResponse = await pb.collection('whatsapp_clicks').getFullList();
    totalWhatsAppClicks = whatsappClicksResponse.length;
    logger.info('WhatsApp clicks data aggregated', { totalWhatsAppClicks });
  } catch (error) {
    logger.warn('whatsapp_clicks collection not found or empty:', error.message);
  }

  // Query artisans collection
  let totalArtisans = 0;
  let artisansByStatus = {};
  try {
    const artisansResponse = await pb.collection('artisans').getFullList();
    totalArtisans = artisansResponse.length;

    // Count artisans by status
    artisansResponse.forEach((artisan) => {
      const status = artisan.statut || 'unknown';
      artisansByStatus[status] = (artisansByStatus[status] || 0) + 1;
    });

    logger.info('Artisans data aggregated', {
      totalArtisans,
      statusCount: Object.keys(artisansByStatus).length,
    });
  } catch (error) {
    logger.warn('artisans collection not found or empty:', error.message);
  }

  logger.info('Analytics summary compiled successfully');

  res.json({
    totalLeads,
    leadsByStatus,
    leadsByCategory,
    totalWhatsAppClicks,
    totalArtisans,
    artisansByStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;