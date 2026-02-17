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

// FIX: helmet crossOriginResourcePolicy blocks assets from Vercel frontend
app.use(helmet({ crossOriginResourcePolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 10000,
});
app.use('/api/', limiter);

// FIX: CORS was only allowing single string origin - breaks Vercel preview URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (Postman, mobile)
      if (!origin) return callback(null, true);
      // Allow all *.vercel.app subdomains (preview deployments)
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      // Allow listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('CORS: ' + origin + ' not allowed'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// FIX: OPTIONS preflight MUST be before all routes
app.options('*', cors());

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

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EMORA Backend Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EMORA Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

export default app;
