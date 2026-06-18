import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to generate transaction ID
function generateTransactionId() {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Helper function to calculate next payment date (30 days from today)
function calculateNextPaymentDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
}

// POST /payments/airtel-money
router.post('/airtel-money', async (req, res) => {
  const { artisan_id, amount, phone_number } = req.body;

  if (!artisan_id || !amount || !phone_number) {
    return res.status(400).json({ error: 'Missing required fields: artisan_id, amount, phone_number' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }

  const transactionId = generateTransactionId();

  const paymentRecord = await pb.collection('payments').create({
    artisan_id,
    amount,
    phone_number,
    transaction_id: transactionId,
    status: 'pending',
    payment_method: 'airtel_money',
    created_at: new Date().toISOString(),
  });

  logger.info(`Airtel Money payment initiated: ${transactionId} for artisan ${artisan_id}`);

  res.json({
    transaction_id: paymentRecord.transaction_id,
    status: paymentRecord.status,
  });
});

// POST /payments/mtn-money
router.post('/mtn-money', async (req, res) => {
  const { artisan_id, amount, phone_number } = req.body;

  if (!artisan_id || !amount || !phone_number) {
    return res.status(400).json({ error: 'Missing required fields: artisan_id, amount, phone_number' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }

  const transactionId = generateTransactionId();

  const paymentRecord = await pb.collection('payments').create({
    artisan_id,
    amount,
    phone_number,
    transaction_id: transactionId,
    status: 'pending',
    payment_method: 'mtn_money',
    created_at: new Date().toISOString(),
  });

  logger.info(`MTN Money payment initiated: ${transactionId} for artisan ${artisan_id}`);

  res.json({
    transaction_id: paymentRecord.transaction_id,
    status: paymentRecord.status,
  });
});

// POST /payments/verify/:transactionId
router.post('/verify/:transactionId', async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId parameter is required' });
  }

  // Fetch payment record by transaction_id
  const paymentRecords = await pb.collection('payments').getList(1, 1, {
    filter: `transaction_id = "${transactionId}"`,
  });

  if (paymentRecords.items.length === 0) {
    throw new Error(`Payment record not found for transaction ID: ${transactionId}`);
  }

  const payment = paymentRecords.items[0];

  // Placeholder for actual gateway verification
  // In production, this would call the payment gateway API to verify the transaction
  const isVerified = true; // Assume successful for now

  if (!isVerified) {
    throw new Error('Payment verification failed');
  }

  // Update payment status to 'completed'
  const updatedPayment = await pb.collection('payments').update(payment.id, {
    status: 'completed',
  });

  // Calculate next payment date (30 days from today)
  const nextPaymentDate = calculateNextPaymentDate();

  // Update artisan subscription status
  const artisanRecords = await pb.collection('artisans').getList(1, 1, {
    filter: `id = "${payment.artisan_id}"`,
  });

  if (artisanRecords.items.length > 0) {
    const artisan = artisanRecords.items[0];
    await pb.collection('artisans').update(artisan.id, {
      status: 'active',
      next_payment_date: nextPaymentDate,
    });
  }

  logger.info(`Payment verified and completed: ${transactionId}`);

  res.json({
    status: updatedPayment.status,
    next_payment_date: nextPaymentDate,
  });
});

// GET /payments/history/:artisanId
router.get('/history/:artisanId', async (req, res) => {
  const { artisanId } = req.params;

  if (!artisanId) {
    return res.status(400).json({ error: 'artisanId parameter is required' });
  }

  const paymentHistory = await pb.collection('payments').getList(1, 50, {
    filter: `artisan_id = "${artisanId}"`,
    sort: '-created_at',
  });

  const formattedHistory = paymentHistory.items.map((payment) => ({
    transaction_id: payment.transaction_id,
    date: payment.created_at,
    amount: payment.amount,
    status: payment.status,
    payment_method: payment.payment_method,
  }));

  logger.info(`Fetched payment history for artisan: ${artisanId}`);

  res.json(formattedHistory);
});

export default router;