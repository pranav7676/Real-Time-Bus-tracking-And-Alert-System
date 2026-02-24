import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes, { setLocalStorage } from './routes/auth.js';
import paymentRoutes, { setPaymentLocalStorage } from './routes/payment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB or fallback to local storage
async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbus';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('⚠️  MongoDB not available, using in-memory storage');
    setLocalStorage(true);
    setPaymentLocalStorage(true);
  }

  app.listen(PORT, () => {
    console.log(`🚀 SmartBus API Server running on http://localhost:${PORT}`);
  });
}

startServer();
