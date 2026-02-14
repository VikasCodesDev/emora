import { Request, Response } from 'express';
import axios from 'axios';

export const getRandomQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category = 'motivational' } = req.query;
    
    const quotes = [
      { text: "You miss 100% of the shots you don't take", author: "Wayne Gretzky", category: "motivational" },
      { text: "Be yourself; everyone else is already taken", author: "Oscar Wilde", category: "life" },
      { text: "Success is not final, failure is not fatal", author: "Winston Churchill", category: "success" },
      { text: "The only way to do great work is to love what you do", author: "Steve Jobs", category: "work" },
      { text: "Dream big, work hard, stay focused", author: "Anonymous", category: "motivational" }
    ];

    const filteredQuotes = quotes.filter(q => q.category === category);
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] || quotes[0];

    res.status(200).json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch quote' });
  }
};

export const generateAiQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic = 'life', mood = 'positive' } = req.body;
    
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi3:mini',
      prompt: `Generate a ${mood} quote about ${topic}. Make it Gen-Z friendly, short, and impactful. Only return the quote, no additional text.`,
      stream: false
    });

    const generatedQuote = ollamaResponse.data.response.trim();

    res.status(200).json({ 
      success: true, 
      quote: {
        text: generatedQuote,
        author: 'AI Generated',
        category: topic
      }
    });
  } catch (error: any) {
    const fallbackQuote = {
      text: "Your vibe attracts your tribe. Keep shining! ✨",
      author: "AI Generated",
      category: "motivation"
    };
    res.status(200).json({ success: true, quote: fallbackQuote });
  }
};
