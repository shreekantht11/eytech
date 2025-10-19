import express from 'express';
import Customer from '../models/Customer';
import { getPreApprovedOffers, getCreditScore } from '../services/creditBureau';
import { verifyKYC } from '../agents/verificationAgent';

const router = express.Router();

// Get customer offers
router.get('/offers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const offers = await getPreApprovedOffers(customerId);
    res.json(offers);
  } catch (error) {
    console.error('Offers error:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Verify KYC
router.post('/verify-kyc', async (req, res) => {
  try {
    const { sessionId, phone } = req.body;

    if (!sessionId || !phone) {
      return res.status(400).json({ error: 'sessionId and phone are required' });
    }

    const result = await verifyKYC(sessionId, phone);
    res.json(result);
  } catch (error) {
    console.error('KYC verification error:', error);
    res.status(500).json({ error: 'Failed to verify KYC' });
  }
});

// Get credit score
router.get('/credit-score/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const creditScore = await getCreditScore(customerId);
    res.json({ customerId, creditScore });
  } catch (error) {
    console.error('Credit score error:', error);
    res.status(500).json({ error: 'Failed to fetch credit score' });
  }
});

export default router;
