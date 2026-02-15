import express from 'express';
import {
  searchMusic,
  getTrending,
  getAlbum,
  getArtist,
  saveMusic,
  getSavedMusic,
  removeSavedMusic
} from '../controllers/musicController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/search', searchMusic);
router.get('/trending', getTrending);
router.get('/album/:id', getAlbum);
router.get('/artist/:id', getArtist);

// Protected routes  
router.post('/save', protect, saveMusic);
router.get('/saved', protect, getSavedMusic);
router.delete('/saved/:id', protect, removeSavedMusic);

export default router;
