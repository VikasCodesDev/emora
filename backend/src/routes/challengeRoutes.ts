import express from 'express';
import { getDailyChallenge, submitChallenge, getLeaderboard, voteSubmission } from '../controllers/challengeController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/daily', getDailyChallenge);
router.post('/submit', protect, submitChallenge);
router.get('/leaderboard/:challengeId', getLeaderboard);
router.post('/vote', protect, voteSubmission);

export default router;
