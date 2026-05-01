import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

import authRoutes      from './routes/authRoutes.js';
import productRoutes   from './routes/productRoutes.js';
import orderRoutes     from './routes/orderRoutes.js';
import stockLogRoutes  from './routes/stockLogRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // React / Vite frontend
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/products',    productRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/stock-logs',  stockLogRoutes);

// ── Health Check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ERP Backend is running 🚀', timestamp: new Date() });
});

// ── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ────────────────────────────────────
const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🚀 ERP Backend running on http://localhost:${PORT}`);
    console.log(`📋 API Endpoints:`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   GET    /api/products`);
    console.log(`   POST   /api/products`);
    console.log(`   PATCH  /api/products/:id/restock`);
    console.log(`   POST   /api/orders         ← Sales Integration`);
    console.log(`   GET    /api/orders`);
    console.log(`   GET    /api/stock-logs\n`);
  });
};

start();
