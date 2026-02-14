import express from 'express';
import { getTrendingNews, searchNews } from '../controllers/trendingController';

const router = express.Router();

router.get('/news', getTrendingNews);
router.get('/search', searchNews);

export default router;
