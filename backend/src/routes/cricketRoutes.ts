import express from 'express';
import {
  getLiveMatches,
  getRankings,
  getSchedule,
  getTrivia,
  predictMatch
} from '../controllers/cricketController';

const router = express.Router();

router.get('/live', getLiveMatches);
router.get('/rankings', getRankings);
router.get('/schedule', getSchedule);
router.get('/trivia', getTrivia);
router.post('/predict', predictMatch);

export default router;
