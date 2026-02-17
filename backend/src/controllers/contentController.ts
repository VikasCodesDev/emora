import { Request, Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';

const AI_API_URL = process.env.OPENROUTER_AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const AI_API_KEY = process.env.OPENROUTER_API_KEY || '';

// ============================================================
// AI CALL HELPER
// ============================================================
const callAI = async (prompt: string): Promise<string | null> => {
  if (!AI_API_KEY || AI_API_KEY.length < 10) return null;
  try {
    const response = await axios.post(
      AI_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err: any) {
    console.warn('AI call failed:', err?.message);
    return null;
  }
};

// ============================================================
// SMART LOCAL CAPTION GENERATOR (unique per meme title)
// ============================================================
const generateLocalCaption = (memeTitle: string, memeUrl: string): string => {
  const title = (memeTitle || '').toLowerCase();

  // Title-based smart captions
  if (title.includes('monday')) return "Monday energy: survival mode activated 💀";
  if (title.includes('work') || title.includes('office') || title.includes('job')) return "Me at work pretending to be productive 😂";
  if (title.includes('sleep') || title.includes('tired') || title.includes('bed')) return "My bed calling my name at 3pm 🛏️";
  if (title.includes('food') || title.includes('eat') || title.includes('pizza') || title.includes('burger')) return "My diet said no, my heart said yes 🍕";
  if (title.includes('cat') || title.includes('dog') || title.includes('pet')) return "This animal understands me better than humans 🐾";
  if (title.includes('exam') || title.includes('study') || title.includes('test') || title.includes('school')) return "Me studying 5 mins before exam vs. my will to live 📚";
  if (title.includes('money') || title.includes('broke') || title.includes('bank')) return "My wallet after weekend: archaeological remains 💸";
  if (title.includes('gym') || title.includes('workout') || title.includes('fitness')) return "Day 1 of gym vs. Day 1 of quitting gym again 💪";
  if (title.includes('friend') || title.includes('bro') || title.includes('buddy')) return "My friends when I need them vs. when they need me 👀";
  if (title.includes('mom') || title.includes('dad') || title.includes('parent') || title.includes('family')) return "Parents finding out what I do all day 😅";
  if (title.includes('phone') || title.includes('social media') || title.includes('instagram') || title.includes('twitter')) return "Me saying I'll scroll for 5 mins 4 hours ago 📱";
  if (title.includes('game') || title.includes('gaming') || title.includes('play')) return "Just one more game they said. It'll be fun they said 🎮";
  if (title.includes('coffee') || title.includes('morning')) return "Me before coffee vs. me after coffee ☕";
  if (title.includes('night') || title.includes('2am') || title.includes('3am') || title.includes('late')) return "3am brain: let's think about embarrassing things from 2013 🌙";
  if (title.includes('shopping') || title.includes('buy') || title.includes('sale')) return "My bank account watching me enter a sale 😭";
  if (title.includes('rain') || title.includes('weather') || title.includes('cold')) return "Weather said nope to my plans today 🌧️";
  if (title.includes('movie') || title.includes('netflix') || title.includes('show') || title.includes('series')) return "Just one episode they said 6 episodes ago 🎬";
  if (title.includes('relationship') || title.includes('love') || title.includes('crush') || title.includes('date')) return "My dating life: a tragicomedy in infinite acts 💔";
  if (title.includes('birthday') || title.includes('party') || title.includes('celebrate')) return "Me pretending to enjoy my own birthday 🎂";
  if (title.includes('travel') || title.includes('trip') || title.includes('vacation')) return "My plans vs. my bank account vs. my boss 🌍";

  // Use URL hash for variety if no title match
  const urlHash = memeUrl ? memeUrl.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;

  const fallbacks = [
    "POV: You just understood the assignment 💯",
    "Nobody: ... Me at 2am: 🤡",
    "The accuracy is making me uncomfortable 😭",
    "Why does this describe my entire life 💀",
    "Okay but why is this so real though 👁️",
    "My therapist would have a field day with this 😅",
    "Current mood: this entire meme 🫡",
    "The audacity. The nerve. The ACCURACY. 💅",
    "Scientists have discovered my daily routine 🔬",
    "This meme just called me out personally 😤",
    "Relatability level: 10000% 🎯",
    "Main character energy or NPC life? Yes. 🎭",
    "The vibe check passed with flying colors ✅",
    "Plot twist: I am the meme 🪞",
    "My Roman Empire: this meme 🏛️",
    "Serotonin acquired via meme consumption 🧪",
    "No thoughts. Head empty. Just vibes. ✨",
    "This slapped harder than my alarm clock ⏰",
    "Fr fr no cap this is so real 🙏",
    "*screenshots for future emotional support* 📸",
  ];

  return fallbacks[urlHash % fallbacks.length];
};

// ============================================================
// GET MEMES
// @route GET /api/content/memes
// @access Public
// ============================================================
export const getMemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20 } = req.query;
    const response = await axios.get('https://meme-api.com/gimme/' + limit, { timeout: 10000 });
    res.status(200).json({
      success: true,
      memes: response.data.memes || [response.data],
    });
  } catch (error: any) {
    console.error('Memes fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching memes' });
  }
};

// ============================================================
// GENERATE MEME CAPTION (UNIQUE PER MEME)
// @route POST /api/content/memes/caption
// @access Private
// ============================================================
export const generateMemeCaption = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memeTitle, memeUrl } = req.body;

    if (!memeTitle && !memeUrl) {
      res.status(400).json({ success: false, message: 'memeTitle or memeUrl required' });
      return;
    }

    // Try AI first with rich context
    const prompt = `You are a Gen-Z meme caption writer. Write ONE funny, unique, relatable caption for this specific meme.

Meme title: "${memeTitle}"
Meme URL: ${memeUrl || 'N/A'}

Rules:
- Max 100 characters
- Make it specific to THIS meme's topic/theme
- Gen-Z humor: relatable, witty, use emojis
- Do NOT use generic captions
- Return ONLY the caption, nothing else`;

    const aiCaption = await callAI(prompt);

    // Use AI caption if valid, else generate locally based on meme title
    const caption = (aiCaption && aiCaption.length > 5 && aiCaption.length < 150)
      ? aiCaption
      : generateLocalCaption(memeTitle || '', memeUrl || '');

    res.status(200).json({ success: true, caption });
  } catch (error: any) {
    console.error('Caption generation error:', error);
    // Always return a unique fallback based on title
    const caption = generateLocalCaption(req.body.memeTitle || '', req.body.memeUrl || '');
    res.status(200).json({ success: true, caption });
  }
};

// ============================================================
// GET MOOD PLAYLISTS
// @route GET /api/content/music/playlists
// @access Private
// ============================================================
export const getMoodPlaylists = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood = 'happy' } = req.query;
    const authResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
      }
    );
    const accessToken = authResponse.data.access_token;
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood + ' mood')}&type=playlist&limit=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.status(200).json({ success: true, playlists: searchResponse.data.playlists.items });
  } catch (error: any) {
    console.error('Spotify playlists error:', error);
    res.status(500).json({ success: false, message: 'Error fetching playlists' });
  }
};

// ============================================================
// GET CRICKET MATCHES
// @route GET /api/content/cricket/matches
// @access Public
// ============================================================
export const getCricketMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const mockMatches = [
      { id: 1, team1: 'India', team2: 'Australia', team1Score: '285/7', team2Score: '240/10', status: 'India won by 45 runs', isLive: false },
      { id: 2, team1: 'England', team2: 'Pakistan', team1Score: '156/4', team2Score: '89/3', status: 'Live - England batting', isLive: true },
    ];
    res.status(200).json({ success: true, matches: mockMatches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching cricket matches' });
  }
};

// ============================================================
// GET WALLPAPERS
// @route GET /api/content/wallpapers
// @access Public
// ============================================================
export const getWallpapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mood, limit = 20 } = req.query;
    const mockWallpapers = Array.from({ length: Number(limit) }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/1920/1080?random=${i + Math.floor(Math.random() * 1000)}`,
      thumbnail: `https://picsum.photos/400/300?random=${i + Math.floor(Math.random() * 1000)}`,
      mood: mood || 'neutral',
      author: `Photographer ${i + 1}`,
    }));
    res.status(200).json({ success: true, wallpapers: mockWallpapers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching wallpapers' });
  }
};

// ============================================================
// GENERATE QUOTE
// @route POST /api/content/quotes/generate
// @access Private
// ============================================================
export const generateQuote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood = 'inspirational', topic = 'life' } = req.body;
    const prompt = `Generate a ${mood} quote about ${topic}. Gen-Z friendly, short (max 150 chars), impactful. Return only the quote text.`;
    const aiQuote = await callAI(prompt);
    const quote = aiQuote || 'Keep going, the best is yet to come ✨';
    res.status(200).json({ success: true, quote, mood });
  } catch (error: any) {
    res.status(200).json({ success: true, quote: 'Keep going, the best is yet to come ✨', mood: 'inspirational' });
  }
};

// ============================================================
// GET HOROSCOPE
// @route GET /api/content/astro/horoscope/:sign
// @access Public
// ============================================================
export const getHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;
    const prompt = `Write a short daily horoscope (max 150 characters) for ${sign}. Positive and uplifting. Return only the horoscope text.`;
    const aiHoroscope = await callAI(prompt);
    const horoscope = aiHoroscope || 'Today brings positive energy and exciting new opportunities!';
    res.status(200).json({ success: true, sign, horoscope, date: new Date().toISOString().split('T')[0] });
  } catch (error: any) {
    res.status(200).json({ success: true, sign: req.params.sign, horoscope: 'Today brings positive energy and exciting new opportunities!', date: new Date().toISOString().split('T')[0] });
  }
};

// ============================================================
// GET FASHION SUGGESTIONS
// @route POST /api/content/fashion/suggestions
// @access Private
// ============================================================
export const getFashionSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood = 'casual', occasion = 'general' } = req.body;
    const prompt = `Suggest a ${mood} outfit for ${occasion}. List 4-5 trendy items, comma-separated. Gen-Z fashion. Return only the list.`;
    const aiSuggestions = await callAI(prompt);
    const suggestions = aiSuggestions || 'Oversized tee, baggy jeans, chunky sneakers, chain necklace';
    res.status(200).json({ success: true, suggestions, mood, occasion });
  } catch (error: any) {
    res.status(200).json({ success: true, suggestions: 'Oversized tee, baggy jeans, chunky sneakers, chain necklace', mood: 'casual', occasion: 'general' });
  }
};