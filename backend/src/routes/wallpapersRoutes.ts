import express from 'express';
import { getWallpapers, downloadWallpaper } from '../controllers/wallpapersController';

const router = express.Router();

router.get('/', getWallpapers);
router.get('/download/:id', downloadWallpaper);

export default router;
