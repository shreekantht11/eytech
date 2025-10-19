import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Session from '../models/Session';
import Customer from '../models/Customer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../uploads/salary-slips');
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      // ignore
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'salary-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  },
});

router.post('/upload-salary', upload.single('file'), async (req, res) => {
  try {
    const { sessionId, salary } = req.body;

    if (!sessionId || !salary) {
      return res.status(400).json({ error: 'sessionId and salary are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const session = await Session.findOne({ sessionId });
    
    if (!session || !session.customerId) {
      return res.status(404).json({ error: 'Session or customer not found' });
    }

    // Update customer salary
    await Customer.findOneAndUpdate(
      { customerId: session.customerId },
      { salary: parseInt(salary) }
    );

    // Update session
    await Session.findOneAndUpdate(
      { sessionId },
      {
        salarySlipUploaded: true,
        $push: {
          auditLog: {
            action: 'SALARY_SLIP_UPLOADED',
            timestamp: new Date(),
            details: {
              filename: req.file.filename,
              salary: parseInt(salary),
            },
          },
        },
      }
    );

    res.json({
      success: true,
      message: 'Salary slip uploaded successfully',
      filename: req.file.filename,
      salary: parseInt(salary),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload salary slip' });
  }
});

export default router;
