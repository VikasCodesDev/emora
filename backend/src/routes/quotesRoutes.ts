import express from 'express';
import { getRandomQuote, generateAiQuote } from '../controllers/quotesController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/random', getRandomQuote);
router.post('/generate', protect, generateAiQuote);

export default router;
