import { Request, Response } from 'express';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Fallback news when API fails or key missing
const fallbackNews = [
  { title: 'AI Revolution: How Artificial Intelligence is Changing Everything', description: 'From healthcare to education, AI is transforming industries at unprecedented speed.', url: 'https://techcrunch.com', urlToImage: 'https://picsum.photos/800/400?random=1', publishedAt: new Date().toISOString(), source: { name: 'Tech News' } },
  { title: 'SpaceX Successfully Launches Next-Generation Satellite Constellation', description: 'Another milestone in commercial space exploration as reusable rockets continue to prove their worth.', url: 'https://space.com', urlToImage: 'https://picsum.photos/800/400?random=2', publishedAt: new Date().toISOString(), source: { name: 'Space News' } },
  { title: 'Global Climate Summit Reaches Historic Agreement on Emissions', description: 'World leaders commit to ambitious new targets as scientists warn of accelerating changes.', url: 'https://reuters.com', urlToImage: 'https://picsum.photos/800/400?random=3', publishedAt: new Date().toISOString(), source: { name: 'Reuters' } },
  { title: 'Tech Giants Report Record Earnings Amid AI Investment Wave', description: 'Major technology companies continue to see explosive growth driven by AI product launches.', url: 'https://bloomberg.com', urlToImage: 'https://picsum.photos/800/400?random=4', publishedAt: new Date().toISOString(), source: { name: 'Bloomberg' } },
  { title: 'New Study Reveals Surprising Benefits of Daily Exercise on Brain Health', description: 'Researchers discover that even 20 minutes of moderate exercise significantly improves cognitive function.', url: 'https://healthnews.com', urlToImage: 'https://picsum.photos/800/400?random=5', publishedAt: new Date().toISOString(), source: { name: 'Health News' } },
  { title: 'Breakthrough in Renewable Energy Storage Could Solve Grid Reliability', description: 'New battery technology promises to store solar and wind power efficiently for weeks.', url: 'https://energynews.com', urlToImage: 'https://picsum.photos/800/400?random=6', publishedAt: new Date().toISOString(), source: { name: 'Energy News' } },
  { title: 'Social Media Platforms Introduce New Creator Monetization Tools', description: 'Platforms compete for top content creators with improved revenue sharing programs.', url: 'https://socialmedia.com', urlToImage: 'https://picsum.photos/800/400?random=7', publishedAt: new Date().toISOString(), source: { name: 'Social Media Today' } },
  { title: 'Cryptocurrency Markets See Surge as Institutional Adoption Grows', description: 'Bitcoin and Ethereum reach new milestones as major banks launch crypto services.', url: 'https://coindesk.com', urlToImage: 'https://picsum.photos/800/400?random=8', publishedAt: new Date().toISOString(), source: { name: 'CoinDesk' } },
];

export const getTrendingNews = async (req: Request, res: Response): Promise<void> => {
  try {
    // FIX: Guard against missing API key — was crashing with 500
    if (!NEWS_API_KEY) {
      res.status(200).json({ success: true, news: fallbackNews });
      return;
    }

    const { category = 'general' } = req.query;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { apiKey: NEWS_API_KEY, category, language: 'en', pageSize: 20 },
      timeout: 8000,
    });

    const articles = response.data.articles || [];
    // FIX: newsapi returns removed articles with "[Removed]" title — filter them
    const filtered = articles.filter(
      (a: any) => a.title && a.title !== '[Removed]' && a.urlToImage
    );

    res.status(200).json({ success: true, news: filtered.length > 0 ? filtered : fallbackNews });
  } catch (error: any) {
    console.error('Trending news error:', error.message);
    // FIX: return fallback instead of crashing
    res.status(200).json({ success: true, news: fallbackNews });
  }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ success: false, message: 'Query parameter required' });
      return;
    }

    if (!NEWS_API_KEY) {
      res.status(200).json({ success: true, news: fallbackNews });
      return;
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: { apiKey: NEWS_API_KEY, q: query, sortBy: 'publishedAt', pageSize: 20 },
      timeout: 8000,
    });

    const articles = response.data.articles || [];
    const filtered = articles.filter(
      (a: any) => a.title && a.title !== '[Removed]' && a.urlToImage
    );

    res.status(200).json({ success: true, news: filtered.length > 0 ? filtered : fallbackNews });
  } catch (error: any) {
    console.error('Search news error:', error.message);
    res.status(200).json({ success: true, news: fallbackNews });
  }
};
