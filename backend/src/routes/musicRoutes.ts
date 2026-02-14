import express from 'express';
import { getTrendingSongs, searchSongs, getAlbum, getArtist, createPlaylist, getUserPlaylists } from '../controllers/musicController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/trending', getTrendingSongs);
router.get('/search', searchSongs);
router.get('/album/:id', getAlbum);
router.get('/artist/:id', getArtist);
router.post('/playlist', protect, createPlaylist);
router.get('/playlists', protect, getUserPlaylists);

export default router;
