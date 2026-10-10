import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/courses.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    service: 'AI Learning Roadmap & Video Platform'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/settings', settingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI Learning Platform Server listening on port ${PORT}`);
  console.log(`👑 Host Admin Account: host@learningidea.com (Password: host123)`);
  console.log(`🎓 Approved Student:   alex.student@learningidea.com (Password: student123)`);
  console.log(`⏳ Pending Student:    sarah.jenkins@learningidea.com (Password: student123)`);
  console.log(`=======================================================`);
});
