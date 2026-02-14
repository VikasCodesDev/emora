import { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import { AuthRequest } from '../middleware/auth';

export const getDailyChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let challenge = await Challenge.findOne({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    if (!challenge) {
      challenge = await Challenge.create({
        title: "Share Your Vibe Check! ✨",
        description: "Post what's making you happy today. Could be music, food, meme, anything!",
        type: "text",
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        submissions: [],
      });
    }

    res.status(200).json({ success: true, challenge });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch challenge' });
  }
};

export const submitChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId, response, imageUrl } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const alreadySubmitted = challenge.submissions.some(
      (sub) => sub.userId.toString() === req.user!._id.toString()
    );

    if (alreadySubmitted) {
      res.status(400).json({ success: false, message: 'Already submitted' });
      return;
    }

    challenge.submissions.push({
      userId: req.user!._id,
      response,
      imageUrl,
      score: 0,
      createdAt: new Date(),
    });

    await challenge.save();

    res.status(200).json({ success: true, message: 'Submission successful' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId).populate('submissions.userId', 'name');

    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const leaderboard = challenge.submissions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json({ success: true, leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

export const voteSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId, submissionIndex } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    if (submissionIndex >= challenge.submissions.length) {
      res.status(400).json({ success: false, message: 'Invalid submission' });
      return;
    }

    challenge.submissions[submissionIndex].score += 1;
    await challenge.save();

    res.status(200).json({ success: true, message: 'Vote recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to vote' });
  }
};
