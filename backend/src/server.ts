import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Import routes
import chatRoutes from './routes/chat';
import customerRoutes from './routes/customer';
import sanctionRoutes from './routes/sanction';
import uploadRoutes from './routes/upload';
import adminRoutes from './routes/admin';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directories
const uploadsDir = path.join(__dirname, '../uploads');
const salarySlipsDir = path.join(uploadsDir, 'salary-slips');
const sanctionsDir = path.join(uploadsDir, 'sanctions');

[uploadsDir, salarySlipsDir, sanctionsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Tata Capital AI Chatbot API',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      offers: 'GET /api/offers/:customerId',
      verifyKYC: 'POST /api/verify-kyc',
      creditScore: 'GET /api/credit-score/:customerId',
      uploadSalary: 'POST /api/upload-salary',
      downloadSanction: 'GET /api/sanction/:sanctionId/download',
      adminSessions: 'GET /api/admin/sessions',
      adminSanctions: 'GET /api/admin/sanctions',
    },
  });
});

app.use('/api', chatRoutes);
app.use('/api', customerRoutes);
app.use('/api', sanctionRoutes);
app.use('/api', uploadRoutes);
app.use('/api', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API documentation available at http://localhost:${PORT}`);
    
    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not found in .env - AI features will not work');
    }
  });
};

startServer();
