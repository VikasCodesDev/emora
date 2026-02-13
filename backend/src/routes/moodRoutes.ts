import express from 'express';
import {
  analyzeTextMood,
  analyzeImageMood,
} from '../controllers/moodController';
import { protect } from '../middleware/auth';
import { validate, moodTextSchema } from '../middleware/validation';

const router = express.Router();

router.post('/analyze-text', protect, validate(moodTextSchema), analyzeTextMood);
router.post('/analyze-image', protect, analyzeImageMood);

export default router;
