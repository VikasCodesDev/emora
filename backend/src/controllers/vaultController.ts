import { Response } from 'express';
import SavedContent from '../models/SavedContent';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all saved content for user
// @route   GET /api/vault
// @access  Private
export const getVaultContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.query;

    const query: any = { userId: req.user!._id };
    if (type) {
      query.type = type;
    }

    const savedContent = await SavedContent.find(query).sort({ createdAt: -1 });

    // Group by type for analytics
    const groupedByType = savedContent.reduce((acc: any, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      total: savedContent.length,
      content: savedContent,
      groupedByType,
    });
  } catch (error: any) {
    console.error('Get vault content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vault content',
    });
  }
};

// @desc    Save content to vault
// @route   POST /api/vault/save
// @access  Private
export const saveToVault = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, contentData } = req.body;

    const savedContent = await SavedContent.create({
      userId: req.user!._id,
      type,
      contentData,
    });

    res.status(201).json({
      success: true,
      message: 'Content saved to vault',
      content: savedContent,
    });
  } catch (error: any) {
    console.error('Save to vault error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving content',
    });
  }
};

// @desc    Delete content from vault
// @route   DELETE /api/vault/:id
// @access  Private
export const deleteFromVault = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const content = await SavedContent.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Content removed from vault',
    });
  } catch (error: any) {
    console.error('Delete from vault error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting content',
    });
  }
};

// @desc    Get vault analytics
// @route   GET /api/vault/analytics
// @access  Private
export const getVaultAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const savedContent = await SavedContent.find({ userId: req.user!._id });

    // Calculate analytics
    const totalSaved = savedContent.length;
    const typeCount = savedContent.reduce((acc: any, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    // Get mood distribution from mood saves
    const moodSaves = savedContent.filter((item) => item.type === 'mood');
    const moodDistribution = moodSaves.reduce((acc: any, item) => {
      const mood = item.contentData.mood || 'unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = savedContent.filter(
      (item) => new Date(item.createdAt) > sevenDaysAgo
    );

    res.status(200).json({
      success: true,
      analytics: {
        totalSaved,
        byType: typeCount,
        moodDistribution,
        recentActivityCount: recentActivity.length,
        firstSaveDate: savedContent[savedContent.length - 1]?.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Vault analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching analytics',
    });
  }
};
