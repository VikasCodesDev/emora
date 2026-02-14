import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

import authRoutes from './routes/authRoutes';
import moodRoutes from './routes/moodRoutes';
import contentRoutes from './routes/contentRoutes';
import vaultRoutes from './routes/vaultRoutes';
import cricketRoutes from './routes/cricketRoutes';
import musicRoutes from './routes/musicRoutes';
import trendingRoutes from './routes/trendingRoutes';
import wallpapersRoutes from './routes/wallpapersRoutes';
import quotesRoutes from './routes/quotesRoutes';
import challengeRoutes from './routes/challengeRoutes';
import pollsRoutes from './routes/pollsRoutes';
import astroRoutes from './routes/astroRoutes';
import fashionRoutes from './routes/fashionRoutes';

const app: Application = express();

connectDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/cricket', cricketRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/wallpapers', wallpapersRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/astro', astroRoutes);
app.use('/api/fashion', fashionRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║       🌟 EMORA Backend Server 🌟      ║
  ║                                       ║
  ║   Server running on port ${PORT}       ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
  `);
});

export default app;
