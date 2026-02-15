import express from 'express';
import {
  getLiveMatches,
  getMatchScorecard,
  getSchedule,
  getRankings,
  getTrivia,
  predictMatch
} from '../controllers/cricketController';

const router = express.Router();

router.get('/live', getLiveMatches);
router.get('/scorecard/:id', getMatchScorecard);
router.get('/schedule', getSchedule);
router.get('/rankings', getRankings);
router.get('/trivia', getTrivia);
router.post('/predict', predictMatch);

export default router;
