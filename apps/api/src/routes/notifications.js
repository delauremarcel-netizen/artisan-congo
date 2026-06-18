import 'dotenv/config';
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// Email templates
const emailTemplates = {
  new_lead: (leadData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F7A4C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #1F7A4C; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
        .button { display: inline-block; background-color: #1F7A4C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .detail { margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #1F7A4C; }
        .label { font-weight: bold; color: #1F7A4C; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🟢 ArtisanCongo - Nouvelle Demande</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Une nouvelle demande a été créée sur ArtisanCongo.</p>
          
          <div class="detail">
            <p><span class="label">ID Demande:</span> ${leadData.leadId}</p>
            <p><span class="label">Client:</span> ${leadData.clientName}</p>
            <p><span class="label">Téléphone:</span> ${leadData.clientPhone}</p>
            <p><span class="label">Email:</span> ${leadData.clientEmail}</p>
            <p><span class="label">Catégorie:</span> ${leadData.category}</p>
            <p><span class="label">Statut:</span> ${leadData.status}</p>
            <p><span class="label">Montant Devis:</span> ${leadData.quoteAmount ? leadData.quoteAmount + ' FCFA' : 'Non spécifié'}</p>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://artisancongo.cg/admin/leads/${leadData.leadId}" class="button">Voir la Demande</a>
            <a href="https://artisancongo.cg/admin/leads/${leadData.leadId}/assign" class="button">Assigner un Artisan</a>
          </p>
          
          <p>Cordialement,<br>L'équipe ArtisanCongo 🟢</p>
        </div>
        <div class="footer">
          <p>© 2024 ArtisanCongo. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  lead_status_change: (leadData, oldStatus, newStatus) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F7A4C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #1F7A4C; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
        .button { display: inline-block; background-color: #1F7A4C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .detail { margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #1F7A4C; }
        .label { font-weight: bold; color: #1F7A4C; }
        .status-change { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🟢 ArtisanCongo - Changement de Statut</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Le statut d'une demande a été modifié.</p>
          
          <div class="detail">
            <p><span class="label">ID Demande:</span> ${leadData.leadId}</p>
            <p><span class="label">Client:</span> ${leadData.clientName}</p>
            <p><span class="label">Catégorie:</span> ${leadData.category}</p>
          </div>
          
          <div class="status-change">
            <p><span class="label">Ancien Statut:</span> ${oldStatus}</p>
            <p><span class="label">Nouveau Statut:</span> ${newStatus}</p>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://artisancongo.cg/admin/leads/${leadData.leadId}" class="button">Voir la Demande</a>
          </p>
          
          <p>Cordialement,<br>L'équipe ArtisanCongo 🟢</p>
        </div>
        <div class="footer">
          <p>© 2024 ArtisanCongo. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  artisan_registration: (artisanData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F7A4C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #1F7A4C; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
        .button { display: inline-block; background-color: #1F7A4C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .detail { margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #1F7A4C; }
        .label { font-weight: bold; color: #1F7A4C; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🟢 ArtisanCongo - Nouvelle Inscription Artisan</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Un nouvel artisan s'est inscrit sur ArtisanCongo.</p>
          
          <div class="detail">
            <p><span class="label">Nom:</span> ${artisanData.nom}</p>
            <p><span class="label">Métier:</span> ${artisanData.métier}</p>
            <p><span class="label">Téléphone:</span> ${artisanData.téléphone}</p>
            <p><span class="label">Localisation:</span> ${artisanData.localisation}</p>
            <p><span class="label">Description:</span> ${artisanData.description}</p>
            <p><span class="label">Statut:</span> En attente de validation</p>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://artisancongo.cg/admin/artisans/pending" class="button">Voir les Inscriptions</a>
            <a href="https://artisancongo.cg/admin/artisans/verify" class="button">Vérifier l'Artisan</a>
          </p>
          
          <p>Cordialement,<br>L'équipe ArtisanCongo 🟢</p>
        </div>
        <div class="footer">
          <p>© 2024 ArtisanCongo. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// POST /notifications/send-email
router.post('/send-email', async (req, res) => {
  const { recipientEmail, subject, templateType, leadData, artisanData } = req.body;

  // Validate required fields
  if (!recipientEmail || !subject || !templateType) {
    return res.status(400).json({
      error: 'Missing required fields: recipientEmail, subject, templateType',
    });
  }

  // Validate template type
  if (!emailTemplates[templateType]) {
    return res.status(400).json({
      error: `Invalid templateType. Supported types: ${Object.keys(emailTemplates).join(', ')}`,
    });
  }

  logger.info('Email notification request received', {
    recipientEmail,
    subject,
    templateType,
  });

  // Generate HTML content based on template type
  let htmlContent;
  try {
    if (templateType === 'new_lead') {
      if (!leadData) throw new Error('leadData is required for new_lead template');
      htmlContent = emailTemplates.new_lead(leadData);
    } else if (templateType === 'lead_status_change') {
      if (!leadData) throw new Error('leadData is required for lead_status_change template');
      const { oldStatus, newStatus } = req.body;
      if (!oldStatus || !newStatus) throw new Error('oldStatus and newStatus are required for lead_status_change template');
      htmlContent = emailTemplates.lead_status_change(leadData, oldStatus, newStatus);
    } else if (templateType === 'artisan_registration') {
      if (!artisanData) throw new Error('artisanData is required for artisan_registration template');
      htmlContent = emailTemplates.artisan_registration(artisanData);
    }
  } catch (error) {
    logger.error('Failed to generate email template:', error.message);
    throw error;
  }

  // Note: In a real PocketBase environment, you would use $app.newMailClient().send(message)
  // For now, we'll log the email and return success
  // This endpoint is designed to be called from PocketBase hooks where $app is available
  
  logger.info('Email notification prepared', {
    to: recipientEmail,
    subject,
    templateType,
  });

  // Generate a message ID
  const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // In production, this would be called from PocketBase with $app.newMailClient()
  // For Express.js, we're just preparing the email data
  // The actual sending happens in PocketBase hooks

  res.json({
    success: true,
    messageId,
    message: 'Email notification prepared and ready to send',
    details: {
      to: recipientEmail,
      subject,
      templateType,
    },
  });
});

export default router;