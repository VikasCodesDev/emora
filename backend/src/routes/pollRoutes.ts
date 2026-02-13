import express from 'express';
import {
  createPoll,
  getPolls,
  votePoll,
  getPollById,
} from '../controllers/pollController';
import { protect } from '../middleware/auth';
import { validate, createPollSchema, votePollSchema } from '../middleware/validation';

const router = express.Router();

router.get('/', getPolls);
router.get('/:id', getPollById);
router.post('/', protect, validate(createPollSchema), createPoll);
router.post('/:id/vote', protect, validate(votePollSchema), votePoll);

export default router;
