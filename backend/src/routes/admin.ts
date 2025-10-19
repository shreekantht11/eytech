import express from 'express';
import Session from '../models/Session';
import Sanction from '../models/Sanction';

const router = express.Router();

// Get all sessions with audit logs
router.get('/admin/sessions', async (req, res) => {
  try {
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('sessionId customerId status currentStep createdAt updatedAt messages auditLog');

    const summary = sessions.map(session => ({
      sessionId: session.sessionId,
      customerId: session.customerId,
      status: session.status,
      currentStep: session.currentStep,
      messageCount: session.messages.length,
      auditLogCount: session.auditLog.length,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    res.json({
      totalSessions: sessions.length,
      sessions: summary,
    });
  } catch (error) {
    console.error('Admin sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session details
router.get('/admin/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Session details error:', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// Get all sanctions
router.get('/admin/sanctions', async (req, res) => {
  try {
    const sanctions = await Sanction.find().sort({ createdAt: -1 }).limit(50);
    res.json(sanctions);
  } catch (error) {
    console.error('Admin sanctions error:', error);
    res.status(500).json({ error: 'Failed to fetch sanctions' });
  }
});

export default router;
