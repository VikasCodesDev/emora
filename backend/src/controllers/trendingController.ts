import { Request, Response } from 'express';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export const getTrendingNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category = 'general' } = req.query;
    
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: NEWS_API_KEY,
        category,
        language: 'en',
        pageSize: 20
      }
    });

    res.status(200).json({ success: true, news: response.data.articles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending news' });
  }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: NEWS_API_KEY,
        q: query,
        sortBy: 'publishedAt',
        pageSize: 20
      }
    });

    res.status(200).json({ success: true, news: response.data.articles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to search news' });
  }
};
