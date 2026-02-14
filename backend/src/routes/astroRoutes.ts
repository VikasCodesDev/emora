import express from 'express';
import { getDailyHoroscope, getCompatibility, getZodiacInfo } from '../controllers/astroController';

const router = express.Router();

router.get('/horoscope/:sign', getDailyHoroscope);
router.get('/compatibility', getCompatibility);
router.get('/info/:sign', getZodiacInfo);

export default router;
