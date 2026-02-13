import { Request, Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';


// @desc    Get memes
// @route   GET /api/content/memes
// @access  Public
export const getMemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20 } = req.query;

    // Fetch from Reddit memes API
    const response = await axios.get('https://meme-api.com/gimme/' + limit);

    res.status(200).json({
      success: true,
      memes: response.data.memes || [response.data],
    });
  } catch (error: any) {
    console.error('Memes fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching memes',
    });
  }
};

// @desc    Generate AI caption for meme
// @route   POST /api/content/memes/caption
// @access  Private
export const generateMemeCaption = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { memeUrl, memeTitle } = req.body;

    const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'phi3:mini',
  prompt: `
You are a witty meme caption generator.
Create funny, relatable Gen-Z captions.
Keep it short (max 100 characters).

Generate a funny caption for this meme titled: ${memeTitle}
  `,
  stream: false
});

const caption = response.data.response.trim();

    

    res.status(200).json({
      success: true,
      caption,
    });
  } catch (error: any) {
    console.error('Caption generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating caption',
    });
  }
};

// @desc    Get Spotify playlists based on mood
// @route   GET /api/content/music/playlists
// @access  Private
export const getMoodPlaylists = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { mood = 'happy' } = req.query;

    // Get Spotify access token
    const authResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
      }
    );

    const accessToken = authResponse.data.access_token;

    // Search for playlists
    const searchQuery = `${mood} mood`;
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchQuery
      )}&type=playlist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({
      success: true,
      playlists: searchResponse.data.playlists.items,
    });
  } catch (error: any) {
    console.error('Spotify playlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching playlists',
    });
  }
};

// @desc    Get cricket matches
// @route   GET /api/content/cricket/matches
// @access  Public
export const getCricketMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Mock cricket data - in production use real API
    const mockMatches = [
      {
        id: 1,
        team1: 'India',
        team2: 'Australia',
        team1Score: '285/7',
        team2Score: '240/10',
        status: 'India won by 45 runs',
        isLive: false,
      },
      {
        id: 2,
        team1: 'England',
        team2: 'Pakistan',
        team1Score: '156/4',
        team2Score: '89/3',
        status: 'Live - England batting',
        isLive: true,
      },
    ];

    res.status(200).json({
      success: true,
      matches: mockMatches,
    });
  } catch (error: any) {
    console.error('Cricket matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cricket matches',
    });
  }
};

// @desc    Get wallpapers
// @route   GET /api/content/wallpapers
// @access  Public
export const getWallpapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mood, limit = 20 } = req.query;

    // Using Unsplash-like data structure
    const mockWallpapers = Array.from({ length: Number(limit) }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/1920/1080?random=${i}`,
      thumbnail: `https://picsum.photos/400/300?random=${i}`,
      mood: mood || 'neutral',
      author: `Photographer ${i + 1}`,
    }));

    res.status(200).json({
      success: true,
      wallpapers: mockWallpapers,
    });
  } catch (error: any) {
    console.error('Wallpapers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wallpapers',
    });
  }
};

// @desc    Generate AI quote
// @route   POST /api/content/quotes/generate
// @access  Private
export const generateQuote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { mood = 'inspirational', topic } = req.body;

    const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'phi3:mini',
  prompt: `
You are a witty meme caption generator.
Create funny, relatable Gen-Z captions.
Keep it short (max 100 characters).

Generate a funny caption for this meme titled: ${memeTitle}
  `,
  stream: false
});

const caption = response.data.response.trim();


    

    res.status(200).json({
      success: true,
      quote,
      mood,
    });
  } catch (error: any) {
    console.error('Quote generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating quote',
    });
  }
};

// @desc    Get horoscope
// @route   GET /api/content/astro/horoscope/:sign
// @access  Public
export const getHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'phi3:mini',
  prompt: `
You are a witty meme caption generator.
Create funny, relatable Gen-Z captions.
Keep it short (max 100 characters).

Generate a funny caption for this meme titled: ${memeTitle}
  `,
  stream: false
});

const caption = response.data.response.trim();


    

    res.status(200).json({
      success: true,
      sign,
      horoscope,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error: any) {
    console.error('Horoscope generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating horoscope',
    });
  }
};

// @desc    Get fashion suggestions
// @route   POST /api/content/fashion/suggestions
// @access  Private
export const getFashionSuggestions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { mood, occasion = 'casual' } = req.body;

    const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'phi3:mini',
  prompt: `
You are a witty meme caption generator.
Create funny, relatable Gen-Z captions.
Keep it short (max 100 characters).

Generate a funny caption for this meme titled: ${memeTitle}
  `,
  stream: false
});

const caption = response.data.response.trim();


    const suggestions = JSON.parse(
    );

    res.status(200).json({
      success: true,
      suggestions,
      mood,
      occasion,
    });
  } catch (error: any) {
    console.error('Fashion suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating fashion suggestions',
    });
  }
};
