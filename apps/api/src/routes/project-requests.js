import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation and normalization helper
function validateAndNormalizePhone(phone) {
  const trimmed = phone.trim();
  if (trimmed.startsWith('0')) {
    return '+243' + trimmed.substring(1);
  } else if (trimmed.startsWith('+243')) {
    return trimmed;
  }
  return null;
}

/**
 * POST /project-requests
 * Create a new project request from a client
 * Body: {clientName, clientPhone, clientEmail, projectType, description, photos (optional)}
 */
router.post('/', upload.array('photos', 5), async (req, res) => {
  const { clientName, clientPhone, clientEmail, projectType, description } = req.body;
  const photos = req.files || [];

  logger.info('Project request received', {
    clientName,
    clientPhone,
    clientEmail,
    projectType,
    photosCount: photos.length,
  });

  // Validate required fields
  if (!clientName || !clientPhone || !clientEmail || !projectType || !description) {
    return res.status(400).json({
      error: 'Champs requis manquants: clientName, clientPhone, clientEmail, projectType, description',
    });
  }

  // Validate email format
  if (!emailRegex.test(clientEmail)) {
    return res.status(400).json({
      error: 'Format d\'email invalide',
    });
  }

  // Validate and normalize phone
  const normalizedPhone = validateAndNormalizePhone(clientPhone);
  if (!normalizedPhone) {
    return res.status(400).json({
      error: 'Le numéro de téléphone doit commencer par +243 ou 0',
    });
  }

  logger.info('Phone number validated and normalized', {
    original: clientPhone,
    normalized: normalizedPhone,
  });

  // Generate reference number
  const referenceNumber = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Upload photos to PocketBase if provided
  const photoUrls = [];
  for (const photo of photos) {
    try {
      logger.info(`Processing photo upload: ${photo.originalname}`);

      const formData = new FormData();
      const blob = new Blob([photo.buffer], { type: photo.mimetype });
      formData.append('photos', blob, photo.originalname);
      formData.append('reference_number', referenceNumber);
      formData.append('client_name', clientName);

      const uploadedRecord = await pb.collection('project_request_photos').create(formData);
      logger.info(`Photo record created in PocketBase with ID: ${uploadedRecord.id}`);

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

  // Create project request record in PocketBase
  logger.info('Creating project request record in PocketBase');
  const projectRequest = await pb.collection('project_requests').create({
    reference_number: referenceNumber,
    nom_client: clientName,
    telephone_client: normalizedPhone,
    email_client: clientEmail,
    type_projet: projectType,
    description,
    photos: photoUrls,
    statut: 'new',
    created_at: new Date().toISOString(),
  });

  logger.info('Project request record created successfully', {
    referenceNumber,
    projectRequestId: projectRequest.id,
  });

  // Send email to admin
  logger.info('Preparing admin notification email');
  const adminEmailSubject = `Nouvelle demande de projet - ${projectType}`;
  const adminEmailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F7A4C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #1F7A4C; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
        .detail { margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #1F7A4C; }
        .label { font-weight: bold; color: #1F7A4C; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🟢 ArtisanCongo - Nouvelle Demande de Projet</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Une nouvelle demande de projet a été reçue.</p>
          
          <div class="detail">
            <p><span class="label">Numéro de Référence:</span> ${referenceNumber}</p>
            <p><span class="label">Nom du Client:</span> ${clientName}</p>
            <p><span class="label">Téléphone:</span> ${normalizedPhone}</p>
            <p><span class="label">Email:</span> ${clientEmail}</p>
            <p><span class="label">Type de Projet:</span> ${projectType}</p>
            <p><span class="label">Description:</span> ${description}</p>
            <p><span class="label">Photos:</span> ${photoUrls.length} fichier(s)</p>
          </div>
          
          <p>Cordialement,<br>L'équipe ArtisanCongo 🟢</p>
        </div>
        <div class="footer">
          <p>© 2024 ArtisanCongo. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  logger.info('Admin email prepared', {
    to: process.env.ADMIN_EMAIL,
    subject: adminEmailSubject,
  });

  // Send confirmation email to client
  logger.info('Preparing client confirmation email');
  const clientEmailSubject = 'Votre demande a été reçue';
  const clientEmailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F7A4C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #1F7A4C; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
        .detail { margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #1F7A4C; }
        .label { font-weight: bold; color: #1F7A4C; }
        .reference { font-size: 18px; font-weight: bold; color: #1F7A4C; background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🟢 ArtisanCongo - Confirmation de Demande</h1>
        </div>
        <div class="content">
          <p>Bonjour ${clientName},</p>
          <p>Merci d'avoir soumis votre demande de projet sur ArtisanCongo. Nous avons bien reçu votre demande et nous la traiterons dans les plus brefs délais.</p>
          
          <div class="reference">
            Numéro de Référence: ${referenceNumber}
          </div>
          
          <div class="detail">
            <p><span class="label">Type de Projet:</span> ${projectType}</p>
            <p><span class="label">Description:</span> ${description}</p>
            <p><span class="label">Date de Soumission:</span> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <p>Vous pouvez utiliser ce numéro de référence pour suivre votre demande. Notre équipe vous contactera bientôt pour discuter des détails de votre projet.</p>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter à contact@artisancongo.com</p>
          
          <p>Cordialement,<br>L'équipe ArtisanCongo 🟢</p>
        </div>
        <div class="footer">
          <p>© 2024 ArtisanCongo. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  logger.info('Client confirmation email prepared', {
    to: clientEmail,
    subject: clientEmailSubject,
  });

  // Note: Email sending would be handled by PocketBase hooks in production
  // For now, we're just logging the email preparation
  logger.info('Emails prepared and ready to send', {
    adminEmail: process.env.ADMIN_EMAIL,
    clientEmail: clientEmail,
  });

  res.json({
    success: true,
    referenceNumber,
    message: 'Votre demande a été reçue avec succès',
    projectRequestId: projectRequest.id,
  });
});

export default router;