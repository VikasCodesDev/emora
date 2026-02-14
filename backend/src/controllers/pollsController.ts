import { Response } from 'express';
import Poll from '../models/Poll';
import { AuthRequest } from '../middleware/auth';

export const createPoll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, options, expiresIn } = req.body;

    const pollOptions = options.map((text: string) => ({
      text,
      votes: 0,
      voters: [],
    }));

    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : undefined;

    const poll = await Poll.create({
      userId: req.user!._id,
      question,
      options: pollOptions,
      expiresAt,
    });

    res.status(201).json({ success: true, poll });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create poll' });
  }
};

export const getPolls = async (req: any, res: Response): Promise<void> => {
  try {
    const polls = await Poll.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, polls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
};

export const votePoll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(id);

    if (!poll) {
      res.status(404).json({ success: false, message: 'Poll not found' });
      return;
    }

    if (poll.expiresAt && new Date() > poll.expiresAt) {
      res.status(400).json({ success: false, message: 'Poll has expired' });
      return;
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      res.status(400).json({ success: false, message: 'Invalid option' });
      return;
    }

    const hasVoted = poll.options.some((option) =>
      option.voters.some((voter) => voter.toString() === req.user!._id.toString())
    );

    if (hasVoted) {
      res.status(400).json({ success: false, message: 'Already voted' });
      return;
    }

    poll.options[optionIndex].votes += 1;
    poll.options[optionIndex].voters.push(req.user!._id);

    await poll.save();

    res.status(200).json({ success: true, message: 'Vote recorded', poll });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to vote' });
  }
};

export const getPollById = async (req: any, res: Response): Promise<void> => {
  try {
    const poll = await Poll.findById(req.params.id).populate('userId', 'name');

    if (!poll) {
      res.status(404).json({ success: false, message: 'Poll not found' });
      return;
    }

    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    res.status(200).json({ success: true, poll, totalVotes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch poll' });
  }
};
