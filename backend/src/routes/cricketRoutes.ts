import express from 'express';
import { getLiveScores, getIccRankings, getMatchSchedule, getCricketTrivia, predictMatch } from '../controllers/cricketController';

const router = express.Router();

router.get('/live-scores', getLiveScores);
router.get('/rankings', getIccRankings);
router.get('/schedule', getMatchSchedule);
router.get('/trivia', getCricketTrivia);
router.post('/predict', predictMatch);

export default router;
