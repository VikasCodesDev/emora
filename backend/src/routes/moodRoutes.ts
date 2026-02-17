import express from 'express';
import { analyzeTextMood, analyzeImageMood } from '../controllers/moodController';
import { protect } from '../middleware/auth';

const router = express.Router();

// FIX: Removed Zod validation middleware that was blocking short but valid texts
// The controller itself handles validation with a reasonable min of 3 chars
router.post('/analyze-text', protect, analyzeTextMood);
router.post('/analyze-image', protect, analyzeImageMood);

export default router;
