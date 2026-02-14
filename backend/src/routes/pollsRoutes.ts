import express from 'express';
import { createPoll, getPolls, votePoll, getPollById } from '../controllers/pollsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getPolls);
router.get('/:id', getPollById);
router.post('/', protect, createPoll);
router.post('/:id/vote', protect, votePoll);

export default router;
