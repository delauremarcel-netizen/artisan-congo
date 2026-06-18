import 'dotenv/config';
import express from 'express';
import { google } from 'googleapis';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /sheets/export-lead
router.post('/export-lead', async (req, res) => {
  const { leadId, clientName, clientPhone, clientEmail, category, assignedArtisan, status, quoteAmount, commissionAmount } = req.body;

  // Validate required fields
  if (!leadId || !clientName || !clientPhone || !clientEmail || !category || !status) {
    return res.status(400).json({
      error: 'Missing required fields: leadId, clientName, clientPhone, clientEmail, category, status',
    });
  }

  logger.info('Google Sheets export request received', {
    leadId,
    clientName,
    category,
    status,
  });

  // Parse Google Sheets API credentials from environment variable
  const apiKeyJson = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKeyJson || apiKeyJson === 'YOUR_GOOGLE_SHEETS_API_KEY') {
    logger.error('GOOGLE_SHEETS_API_KEY environment variable not configured or is placeholder');
    throw new Error('Google Sheets API credentials not configured');
  }

  let credentials;
  try {
    credentials = JSON.parse(apiKeyJson);
  } catch (parseError) {
    logger.error('Failed to parse GOOGLE_SHEETS_API_KEY:', parseError.message);
    throw new Error('Invalid Google Sheets API credentials format');
  }

  logger.info('Google Sheets API credentials parsed successfully');

  // Initialize Google Auth
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  logger.info('Google Auth initialized');

  // Initialize Sheets API
  const sheets = google.sheets({ version: 'v4', auth });

  // Prepare data for Google Sheets
  const timestamp = new Date().toISOString();
  const values = [
    [
      leadId,
      clientName,
      clientPhone,
      clientEmail,
      category,
      assignedArtisan || 'Non assigné',
      status,
      timestamp,
      quoteAmount || 0,
      commissionAmount || 0,
    ],
  ];

  logger.info('Data prepared for Google Sheets', {
    row: values[0],
  });

  // Get spreadsheet ID from environment
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId || spreadsheetId === 'YOUR_GOOGLE_SHEETS_SPREADSHEET_ID') {
    logger.error('GOOGLE_SHEETS_SPREADSHEET_ID environment variable not configured or is placeholder');
    throw new Error('Google Sheets Spreadsheet ID not configured');
  }

  const range = 'Leads!A:J'; // Columns A through J

  logger.info(`Initiating Google Sheets API call`, {
    spreadsheetId,
    range,
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });

  logger.info(`Google Sheets API response received`, {
    status: response.status,
    updatedRows: response.data.updates.updatedRows,
    updatedRange: response.data.updates.updatedRange,
  });

  if (response.status !== 200) {
    logger.error(`Google Sheets API returned non-200 status: ${response.status}`);
    throw new Error(`Google Sheets API error: HTTP ${response.status}`);
  }

  logger.info(`Successfully appended row to Google Sheets: ${response.data.updates.updatedRows} row(s) added`);

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  res.json({
    success: true,
    sheetUrl,
    updatedRows: response.data.updates.updatedRows,
  });
});

// GET /sheets (legacy endpoint - kept for backward compatibility)
router.get('/', async (req, res) => {
  const { nom, metier, telephone, localisation, description, photos } = req.query;

  logger.info('Google Sheets request received', {
    nom,
    metier,
    telephone,
    localisation,
    description,
    photosCount: photos ? (Array.isArray(photos) ? photos.length : 1) : 0,
  });

  // Validate required fields
  if (!nom || !metier || !telephone || !localisation || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: nom, metier, telephone, localisation, description',
    });
  }

  // Parse Google Sheets API credentials from environment variable
  const apiKeyJson = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKeyJson || apiKeyJson === 'YOUR_GOOGLE_SHEETS_API_KEY') {
    logger.error('GOOGLE_SHEETS_API_KEY environment variable not configured or is placeholder');
    throw new Error('Google Sheets API credentials not configured');
  }

  let credentials;
  try {
    credentials = JSON.parse(apiKeyJson);
  } catch (parseError) {
    logger.error('Failed to parse GOOGLE_SHEETS_API_KEY:', parseError.message);
    throw new Error('Invalid Google Sheets API credentials format');
  }

  logger.info('Google Sheets API credentials parsed successfully');

  // Initialize Google Auth
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  logger.info('Google Auth initialized');

  // Initialize Sheets API
  const sheets = google.sheets({ version: 'v4', auth });

  // Prepare data for Google Sheets
  const photosString = Array.isArray(photos) ? photos.join(',') : (photos || '');
  const values = [
    [
      nom,
      metier,
      telephone,
      localisation,
      description,
      photosString,
    ],
  ];

  logger.info('Data prepared for Google Sheets', {
    row: values[0],
  });

  // Append to Google Sheet
  const spreadsheetId = '1XIr-RExJWYtuxg5vE60kf4-t5k-PnK31M8YsA9BI2Mc';
  const range = 'A:F'; // Columns A through F

  logger.info(`Initiating Google Sheets API call`, {
    spreadsheetId,
    range,
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });

  logger.info(`Google Sheets API response received`, {
    status: response.status,
    updatedRows: response.data.updates.updatedRows,
    updatedRange: response.data.updates.updatedRange,
  });

  if (response.status !== 200) {
    logger.error(`Google Sheets API returned non-200 status: ${response.status}`);
    throw new Error(`Google Sheets API error: HTTP ${response.status}`);
  }

  logger.info(`Successfully appended row to Google Sheets: ${response.data.updates.updatedRows} row(s) added`);

  res.json({
    success: true,
    message: 'Data added to Google Sheet',
    updatedRows: response.data.updates.updatedRows,
  });
});

export default router;