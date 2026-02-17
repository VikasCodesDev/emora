import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';

const AI_API_URL = process.env.AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const AI_API_KEY = process.env.AI_API_KEY || '';

// ============================================================
// SMART LOCAL MOOD ANALYZER (works WITHOUT AI API)
// ============================================================
const moodKeywords: Record<string, string[]> = {
  happy: [
    'happy', 'joy', 'excited', 'amazing', 'wonderful', 'great', 'fantastic',
    'love', 'awesome', 'best', 'good', 'glad', 'blessed', 'grateful', 'smile',
    'laugh', 'fun', 'yay', 'wow', 'nice', 'beautiful', 'perfect', 'brilliant',
    'khush', 'mast', 'zabardast', 'accha', 'badiya', 'superb', 'excellent',
  ],
  sad: [
    'sad', 'cry', 'tears', 'depressed', 'unhappy', 'miserable', 'heartbreak',
    'miss', 'lonely', 'alone', 'hurt', 'pain', 'broken', 'lost', 'grief',
    'sorrow', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'die',
    'dukhi', 'udaas', 'bura', 'rona', 'takleef', 'pareshan',
  ],
  angry: [
    'angry', 'anger', 'furious', 'mad', 'rage', 'frustrated', 'irritated',
    'annoyed', 'hate', 'disgusted', 'fed up', 'sick of', 'pissed', 'ugh',
    'stupid', 'idiot', 'ridiculous', 'absurd', 'unfair', 'wrong',
    'gussa', 'naraaz', 'galat', 'bakwaas', 'pagal',
  ],
  anxious: [
    'anxious', 'anxiety', 'worried', 'nervous', 'scared', 'fear', 'panic',
    'stress', 'stressed', 'tense', 'overwhelmed', 'uncertain', 'confused',
    'doubt', 'unsure', 'afraid', 'terrified', 'dread', 'apprehensive',
    'tension', 'darr', 'ghabrahat', 'chinta', 'dar',
  ],
  excited: [
    'excited', 'thrilled', 'pumped', 'hyped', 'cant wait', "can't wait",
    'looking forward', 'amazing', 'incredible', 'unbelievable', 'woah',
    'omg', 'wow', 'epic', 'lit', 'fire', 'insane', 'crazy good',
    'josh', 'utsukat', 'bechain hua',
  ],
  calm: [
    'calm', 'peaceful', 'relaxed', 'chill', 'serene', 'tranquil', 'quiet',
    'content', 'at peace', 'comfortable', 'easy', 'fine', 'okay', 'ok',
    'alright', 'stable', 'balanced', 'composed', 'cool',
    'sukoon', 'chain', 'aaraam', 'theek',
  ],
  hopeful: [
    'hope', 'hopeful', 'optimistic', 'believe', 'faith', 'trust', 'looking up',
    'better', 'improve', 'progress', 'dream', 'wish', 'future', 'soon',
    'will be', 'someday', 'eventually', 'positive', 'confident',
    'ummeed', 'vishwas', 'aas',
  ],
  nostalgic: [
    'miss', 'remember', 'memories', 'old days', 'used to', 'back then',
    'childhood', 'past', 'years ago', 'throwback', 'nostalgia', 'reminisce',
    'purana', 'yaad', 'woh din',
  ],
  stressed: [
    'stress', 'deadline', 'pressure', 'overloaded', 'too much', 'cant handle',
    "can't handle", 'exhausted', 'tired', 'burnout', 'no time', 'busy',
    'work', 'exam', 'test', 'assignment', 'project', 'stuck', 'behind',
    'thaka', 'bahut kaam', 'mushkil',
  ],
};

const moodColors: Record<string, string> = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF4500',
  anxious: '#FF8C00',
  excited: '#FF69B4',
  calm: '#32CD32',
  hopeful: '#00CED1',
  nostalgic: '#9370DB',
  stressed: '#DC143C',
  neutral: '#888888',
};

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  excited: '🤩',
  calm: '😌',
  hopeful: '🌟',
  nostalgic: '🥹',
  stressed: '😫',
  neutral: '😐',
};

const moodExplanations: Record<string, string> = {
  happy: 'Your text radiates positivity and joy!',
  sad: 'Your text expresses sadness or emotional pain.',
  angry: 'Your text shows frustration or anger.',
  anxious: 'Your text reveals worry or anxiety.',
  excited: 'Your text is full of excitement and enthusiasm!',
  calm: 'Your text feels peaceful and composed.',
  hopeful: 'Your text shows optimism and hope for the future.',
  nostalgic: 'Your text reflects on memories and the past.',
  stressed: 'Your text shows signs of stress or pressure.',
  neutral: 'Your text has a balanced, neutral tone.',
};

const analyzeLocally = (text: string) => {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    scores[mood] = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[mood] += 1;
      }
    }
  }

  const topMood = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const detectedMood = topMood[1] > 0 ? topMood[0] : 'neutral';
  const intensity = Math.min(10, Math.max(3, topMood[1] * 2 + 3));

  return {
    mood: detectedMood,
    intensity,
    explanation: moodExplanations[detectedMood],
    color: moodColors[detectedMood],
    emoji: moodEmojis[detectedMood],
  };
};

// ============================================================
// AI CALL (OpenRouter) - with local fallback
// ============================================================
const callAI = async (prompt: string): Promise<string | null> => {
  if (!AI_API_KEY || AI_API_KEY.length < 10) return null;

  try {
    const response = await axios.post(
      AI_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
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
    console.warn('AI API call failed, using local analysis:', err?.message);
    return null;
  }
};

const parseMoodJSON = (raw: string) => {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      // Validate required fields exist
      if (parsed.mood && parsed.intensity && parsed.emoji) {
        return parsed;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// ============================================================
// TEXT MOOD ANALYSIS
// @route POST /api/mood/analyze/text
// @access Private
// ============================================================
export const analyzeTextMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'Please provide some text to analyze.',
      });
      return;
    }

    // Step 1: Try AI analysis
    const prompt = `Analyze the mood of this text and respond ONLY with valid JSON, no extra text:

Text: "${text}"

JSON format:
{
  "mood": "one of: happy/sad/angry/anxious/excited/calm/hopeful/nostalgic/stressed/neutral",
  "intensity": <integer 1-10>,
  "explanation": "one sentence explanation",
  "color": "hex color matching the mood",
  "emoji": "one emoji"
}`;

    const aiRaw = await callAI(prompt);
    let moodData = aiRaw ? parseMoodJSON(aiRaw) : null;

    // Step 2: If AI failed or returned garbage, use local keyword analysis
    if (!moodData) {
      console.log('Using local mood analysis for:', text.substring(0, 50));
      moodData = analyzeLocally(text);
    }

    res.status(200).json({
      success: true,
      data: {
        ...moodData,
        analyzedText: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      },
    });
  } catch (error: any) {
    console.error('analyzeTextMood error:', error);
    // Last resort: still do local analysis, never return raw error
    const localResult = analyzeLocally(req.body.text || '');
    res.status(200).json({
      success: true,
      data: {
        ...localResult,
        analyzedText: (req.body.text || '').substring(0, 100),
      },
    });
  }
};

// ============================================================
// IMAGE MOOD ANALYSIS
// @route POST /api/mood/analyze/image
// @access Private
// ============================================================
export const analyzeImageMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { imageDescription } = req.body;

    if (!imageDescription) {
      res.status(400).json({
        success: false,
        message: 'Please provide an image description.',
      });
      return;
    }

    const prompt = `Analyze the mood of this image description and respond ONLY with valid JSON, no extra text:

Image: "${imageDescription}"

JSON format:
{
  "mood": "one of: happy/sad/angry/anxious/excited/calm/hopeful/nostalgic/stressed/neutral",
  "intensity": <integer 1-10>,
  "explanation": "one sentence explanation",
  "color": "hex color matching the mood",
  "emoji": "one emoji"
}`;

    const aiRaw = await callAI(prompt);
    let moodData = aiRaw ? parseMoodJSON(aiRaw) : null;

    if (!moodData) {
      moodData = analyzeLocally(imageDescription);
    }

    res.status(200).json({ success: true, data: moodData });
  } catch (error: any) {
    console.error('analyzeImageMood error:', error);
    const localResult = analyzeLocally(req.body.imageDescription || '');
    res.status(200).json({ success: true, data: localResult });
  }
};