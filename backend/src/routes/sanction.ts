import express from 'express';
import path from 'path';
import fs from 'fs';
import Sanction from '../models/Sanction';

const router = express.Router();

// Download sanction letter
router.get('/sanction/:sanctionId/download', async (req, res) => {
  try {
    const { sanctionId } = req.params;
    
    const sanction = await Sanction.findOne({ sanctionId });
    
    if (!sanction) {
      return res.status(404).json({ error: 'Sanction letter not found' });
    }

    const filepath = sanction.pdfPath;

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    // Update status to downloaded
    await Sanction.findOneAndUpdate({ sanctionId }, { status: 'downloaded' });

    res.download(filepath, `Sanction_Letter_${sanctionId}.pdf`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download sanction letter' });
  }
});

export default router;
