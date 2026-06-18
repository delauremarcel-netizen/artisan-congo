import express from 'express';
import multer from 'multer';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /artisan-registration
router.post('/', upload.array('photos', 10), async (req, res) => {
  // Log incoming request body
  logger.info('Incoming request body:', JSON.stringify(req.body));

  // Log incoming files
  logger.info('Incoming files:', req.files ? `${req.files.length} file(s) received` : 'No files received');
  if (req.files && req.files.length > 0) {
    logger.info('File details:', req.files.map(f => ({ name: f.originalname, size: f.size, mimetype: f.mimetype })));
  }

  // Extract fields from request body
  const { nom, métier, téléphone, localisation, description } = req.body;
  const photos = req.files || [];

  // Log extracted field values
  logger.info('Extracted field values:', {
    nom: nom || 'MISSING',
    métier: métier || 'MISSING',
    téléphone: téléphone || 'MISSING',
    localisation: localisation || 'MISSING',
    description: description || 'MISSING',
    photosCount: photos.length,
  });

  // Validate required fields
  const missingFields = [];
  if (!nom || nom.trim() === '') missingFields.push('nom');
  if (!métier || métier.trim() === '') missingFields.push('métier');
  if (!téléphone || téléphone.trim() === '') missingFields.push('téléphone');
  if (!localisation || localisation.trim() === '') missingFields.push('localisation');
  if (!description || description.trim() === '') missingFields.push('description');

  if (missingFields.length > 0) {
    logger.warn('Validation failed - missing fields:', missingFields);
    logger.warn('Received fields:', { nom, métier, téléphone, localisation, description });
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields,
      received: { nom, métier, téléphone, localisation, description },
    });
  }

  logger.info('All required fields validated successfully');

  // Upload photos to PocketBase and collect URLs
  const photoUrls = [];

  for (const photo of photos) {
    try {
      logger.info(`Processing photo upload: ${photo.originalname}`);

      // Create FormData for each photo
      const formData = new FormData();
      const blob = new Blob([photo.buffer], { type: photo.mimetype });
      formData.append('photos', blob, photo.originalname);
      formData.append('artisan_nom', nom);
      formData.append('artisan_métier', métier);

      // Upload to PocketBase
      const uploadedRecord = await pb.collection('artisan_registrations').create(formData);
      logger.info(`Photo record created in PocketBase with ID: ${uploadedRecord.id}`);

      // Collect photo URLs from PocketBase response
      if (uploadedRecord.photos && uploadedRecord.photos.length > 0) {
        const photoUrl = pb.files.getUrl(uploadedRecord, uploadedRecord.photos[0]);
        photoUrls.push(photoUrl);
        logger.info(`Photo URL generated: ${photoUrl}`);
      }
    } catch (error) {
      logger.error(`Failed to upload photo ${photo.originalname}:`, error.message);
      // Continue with available photos
    }
  }

  logger.info(`Successfully uploaded ${photoUrls.length} photo(s)`);

  // Build complete registration object
  const registrationObject = {
    timestamp: new Date().toISOString(),
    nom,
    métier,
    téléphone,
    localisation,
    description,
    photos: photoUrls,
    status: 'En attente de validation',
  };

  logger.info('Registration object prepared:', JSON.stringify(registrationObject));

  // Send to Google Sheets webhook
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.error('Google Sheets webhook URL not configured');
    throw new Error('Google Sheets webhook URL not configured');
  }

  logger.info(`Sending registration to Google Sheets webhook: ${webhookUrl}`);

  const sheetsResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationObject),
  });

  if (!sheetsResponse.ok) {
    logger.error(`Google Sheets webhook failed with status ${sheetsResponse.status}`);
    throw new Error('Erreur lors de l\'envoi aux feuilles Google');
  }

  logger.info(`Artisan registration sent to Google Sheets: ${nom}`);

  // Return success response
  res.json({
    success: true,
    registrationId: `REG_${Date.now()}`,
    message: 'Inscription reçue',
  });
});

export default router;