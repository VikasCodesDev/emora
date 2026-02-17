import { Request, Response } from 'express';
import axios from 'axios';

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
        temperature: 0.85,
        max_tokens: 120,
      },
      {
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      }
    );
    const text = response.data.choices[0].message.content.trim();
    // Remove surrounding quotes if AI added them
    return text.replace(/^["']|["']$/g, '').trim();
  } catch (err: any) {
    console.warn('AI quote call failed:', err?.message);
    return null;
  }
};

// ============================================================
// LARGE STATIC QUOTE BANK (by category)
// ============================================================
const quoteBank: Record<string, Array<{ text: string; author: string }>> = {
  motivational: [
    { text: "You miss 100% of the shots you don't take.", author: 'Wayne Gretzky' },
    { text: 'Dream big, work hard, stay focused.', author: 'Anonymous' },
    { text: 'Progress over perfection — always.', author: 'Anonymous' },
    { text: 'The only way out is through.', author: 'Robert Frost' },
    { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
    { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
    { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Ryun' },
    { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
    { text: 'The secret to getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Hard work beats talent when talent doesn\'t work hard.', author: 'Tim Notke' },
  ],
  life: [
    { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
    { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
    { text: 'Your vibe attracts your tribe.', author: 'Anonymous' },
    { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
    { text: 'In the end, we only regret the chances we didn\'t take.', author: 'Anonymous' },
    { text: 'Live, laugh, and let go of what no longer serves you.', author: 'Anonymous' },
    { text: 'The purpose of life is to live it fully.', author: 'Eleanor Roosevelt' },
    { text: 'Choose a life you don\'t need a vacation from.', author: 'Anonymous' },
    { text: 'Speak your truth, even if your voice shakes.', author: 'Anonymous' },
    { text: 'Be the energy you want to attract.', author: 'Anonymous' },
  ],
  success: [
    { text: 'Success is not final, failure is not fatal.', author: 'Winston Churchill' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
    { text: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller' },
    { text: 'Success is stumbling from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
    { text: 'The road to success and the road to failure are almost exactly the same.', author: 'Colin R. Davis' },
    { text: 'Opportunities don\'t happen, you create them.', author: 'Chris Grosser' },
    { text: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson' },
    { text: 'Success is not about the destination, it\'s about the journey.', author: 'Zig Ziglar' },
    { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb' },
  ],
  work: [
    { text: 'Choose a job you love, and you will never work a day in your life.', author: 'Confucius' },
    { text: 'Without ambition one starts nothing.', author: 'Ralph Waldo Emerson' },
    { text: 'Work hard in silence, let success make the noise.', author: 'Frank Ocean' },
    { text: 'The only place success comes before work is in the dictionary.', author: 'Vidal Sassoon' },
    { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
    { text: 'Your work is going to fill a large part of your life — make it great.', author: 'Steve Jobs' },
    { text: 'Nothing will work unless you do.', author: 'Maya Angelou' },
    { text: 'Hustle until your haters ask if you\'re hiring.', author: 'Anonymous' },
    { text: 'Do what you do so well that people can\'t help telling others.', author: 'Walt Disney' },
    { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  ],
  courage: [
    { text: 'It takes courage to grow up and become who you really are.', author: 'E.E. Cummings' },
    { text: 'Courage is not the absence of fear — it\'s acting despite it.', author: 'Mark Twain' },
    { text: 'You are braver than you believe, stronger than you seem.', author: 'A.A. Milne' },
    { text: 'Do one thing every day that scares you.', author: 'Eleanor Roosevelt' },
    { text: 'The brave man is not he who does not feel afraid, but he who conquers that fear.', author: 'Nelson Mandela' },
  ],
  love: [
    { text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
    { text: 'You are my today and all of my tomorrows.', author: 'Leo Christopher' },
    { text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle' },
    { text: 'Where there is love there is life.', author: 'Mahatma Gandhi' },
    { text: 'The greatest happiness of life is the conviction that we are loved.', author: 'Victor Hugo' },
  ],
};

// ============================================================
// SMART LOCAL AI QUOTE GENERATOR (topic-aware fallback)
// ============================================================
const generateLocalQuote = (topic: string, mood: string): { text: string; author: string } => {
  const topicLower = (topic || 'motivational').toLowerCase();

  // Find the best matching category
  let category = 'motivational';
  if (topicLower.includes('life') || topicLower.includes('living')) category = 'life';
  else if (topicLower.includes('success') || topicLower.includes('win') || topicLower.includes('achieve')) category = 'success';
  else if (topicLower.includes('work') || topicLower.includes('career') || topicLower.includes('job') || topicLower.includes('hustle')) category = 'work';
  else if (topicLower.includes('courage') || topicLower.includes('fear') || topicLower.includes('brave')) category = 'courage';
  else if (topicLower.includes('love') || topicLower.includes('heart') || topicLower.includes('relationship')) category = 'love';
  else if (topicLower.includes('motivat') || topicLower.includes('inspire') || topicLower.includes('dream')) category = 'motivational';

  const pool = quoteBank[category] || quoteBank['motivational'];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

// ============================================================
// GET RANDOM QUOTE
// @route GET /api/quotes/random
// @access Public
// ============================================================
export const getRandomQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category = 'motivational' } = req.query;
    const cat = (category as string).toLowerCase();

    const pool = quoteBank[cat] || quoteBank['motivational'];
    const quote = pool[Math.floor(Math.random() * pool.length)];

    res.status(200).json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch quote' });
  }
};

// ============================================================
// GENERATE AI QUOTE
// @route POST /api/quotes/generate
// @access Private (login required)
// ============================================================
export const generateAiQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic = 'life', mood = 'positive', category } = req.body;

    // Use category as topic if topic not provided separately
    const finalTopic = topic || category || 'life';
    const finalMood = mood || 'positive';

    console.log(`Generating AI quote for topic: "${finalTopic}", mood: "${finalMood}"`);

    // Try AI
    const prompt = `Write ONE original, powerful quote about "${finalTopic}" with a ${finalMood} tone.

Rules:
- Max 150 characters
- Gen-Z friendly but timeless
- Impactful and unique
- Do NOT copy existing famous quotes
- Return ONLY the quote text, nothing else, no quotation marks`;

    const aiText = await callAI(prompt);

    if (aiText && aiText.length > 10 && aiText.length < 200) {
      // AI succeeded
      res.status(200).json({
        success: true,
        quote: {
          text: aiText,
          author: 'AI Generated',
          category: finalTopic,
        },
      });
      return;
    }

    // AI failed → use smart local fallback (random from topic-matched bank)
    console.log('AI unavailable, using local quote bank for topic:', finalTopic);
    const localQuote = generateLocalQuote(finalTopic, finalMood);

    res.status(200).json({
      success: true,
      quote: {
        text: localQuote.text,
        author: localQuote.author,
        category: finalTopic,
      },
    });
  } catch (error: any) {
    console.error('generateAiQuote error:', error);
    // Always return something meaningful
    const fallback = quoteBank['motivational'][Math.floor(Math.random() * quoteBank['motivational'].length)];
    res.status(200).json({
      success: true,
      quote: {
        text: fallback.text,
        author: fallback.author,
        category: 'motivational',
      },
    });
  }
};
