import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import cricketRoutes from './routes/cricketRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import moodRoutes from './routes/moodRoutes';
import contentRoutes from './routes/contentRoutes';
import vaultRoutes from './routes/vaultRoutes';
import pollRoutes from './routes/pollRoutes';

const app: Application = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/cricket', cricketRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
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
