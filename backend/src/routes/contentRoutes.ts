import express from 'express';
import {
  getMemes,
  generateMemeCaption,
  getMoodPlaylists,
  getCricketMatches,
  getWallpapers,
  generateQuote,
  getHoroscope,
  getFashionSuggestions,
} from '../controllers/contentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Memes routes
router.get('/memes', getMemes);
router.post('/memes/caption', protect, generateMemeCaption);

// Music routes
router.get('/music/playlists', protect, getMoodPlaylists);

// Cricket routes
router.get('/cricket/matches', getCricketMatches);

// Wallpapers routes
router.get('/wallpapers', getWallpapers);

// Quotes routes
router.post('/quotes/generate', protect, generateQuote);

// Astrology routes
router.get('/astro/horoscope/:sign', getHoroscope);

// Fashion routes
router.post('/fashion/suggestions', protect, getFashionSuggestions);

export default router;
