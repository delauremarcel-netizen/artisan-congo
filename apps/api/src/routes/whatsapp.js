import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /whatsapp/generate-link
router.post('/generate-link', async (req, res) => {
  const { leadId, artisanPhone } = req.body;

  // Validate required fields
  if (!leadId || !artisanPhone) {
    return res.status(400).json({
      error: 'Missing required fields: leadId, artisanPhone',
    });
  }

  logger.info('WhatsApp link generation request', {
    leadId,
    artisanPhone,
  });

  // Generate WhatsApp link
  const message = `Bonjour, j'ai besoin d'aide pour mon projet. Lead ID: ${leadId}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${artisanPhone}?text=${encodedMessage}`;

  logger.info('WhatsApp link generated', {
    leadId,
    artisanPhone,
    url: whatsappUrl,
  });

  res.json({
    whatsappUrl,
    leadId,
    artisanPhone,
  });
});

// POST /whatsapp/track-click
router.post('/track-click', async (req, res) => {
  const { leadId, artisanId } = req.body;

  // Validate required fields
  if (!leadId || !artisanId) {
    return res.status(400).json({
      error: 'Missing required fields: leadId, artisanId',
    });
  }

  logger.info('WhatsApp click tracking request', {
    leadId,
    artisanId,
  });

  // Create record in whatsapp_clicks collection
  const clickRecord = await pb.collection('whatsapp_clicks').create({
    leadId,
    artisanId,
    timestamp: new Date().toISOString(),
    clicked: true,
  });

  logger.info('WhatsApp click tracked', {
    recordId: clickRecord.id,
    leadId,
    artisanId,
  });

  res.json({
    success: true,
    recordId: clickRecord.id,
    timestamp: clickRecord.timestamp,
  });
});

export default router;