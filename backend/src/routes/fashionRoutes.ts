import express from 'express';
import { getTrendingOutfits, getOutfitByStyle, getTrendingItems } from '../controllers/fashionController';

const router = express.Router();

router.get('/outfits', getTrendingOutfits);
router.get('/outfits/:style', getOutfitByStyle);
router.get('/trending', getTrendingItems);

export default router;
