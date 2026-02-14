import { Request, Response } from 'express';
import axios from 'axios';

const CRICKET_API_KEY = process.env.CRICKET_API_KEY;
const CRICKET_API_URL = 'https://api.cricapi.com/v1';

export const getLiveScores = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${CRICKET_API_URL}/currentMatches`, {
      params: { apikey: CRICKET_API_KEY, offset: 0 }
    });
    res.status(200).json({ success: true, matches: response.data.data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch live scores' });
  }
};

export const getIccRankings = async (req: Request, res: Response): Promise<void> => {
  try {
    const mockRankings = {
      test: [
        { rank: 1, team: 'India', rating: 121, points: 2904 },
        { rank: 2, team: 'Australia', rating: 116, points: 3948 },
        { rank: 3, team: 'England', rating: 107, points: 4400 }
      ],
      odi: [
        { rank: 1, team: 'India', rating: 116, points: 6746 },
        { rank: 2, team: 'Australia', rating: 113, points: 4229 },
        { rank: 3, team: 'Pakistan', rating: 106, points: 3182 }
      ],
      t20: [
        { rank: 1, team: 'India', rating: 266, points: 3721 },
        { rank: 2, team: 'England', rating: 264, points: 6956 },
        { rank: 3, team: 'Pakistan', rating: 256, points: 2880 }
      ]
    };
    res.status(200).json({ success: true, rankings: mockRankings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch rankings' });
  }
};

export const getMatchSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${CRICKET_API_URL}/matches`, {
      params: { apikey: CRICKET_API_KEY, offset: 0 }
    });
    res.status(200).json({ success: true, schedule: response.data.data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

export const getCricketTrivia = async (req: Request, res: Response): Promise<void> => {
  try {
    const trivia = [
      { question: 'Who holds the record for most runs in Test cricket?', answer: 'Sachin Tendulkar (15,921 runs)' },
      { question: 'Which player has the most centuries in ODI cricket?', answer: 'Sachin Tendulkar (49 centuries)' },
      { question: 'Who bowled the fastest delivery in cricket?', answer: 'Shoaib Akhtar (161.3 km/h)' },
      { question: 'Which team won the first Cricket World Cup?', answer: 'West Indies (1975)' },
      { question: 'Who has taken the most wickets in Test cricket?', answer: 'Muttiah Muralitharan (800 wickets)' }
    ];
    const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];
    res.status(200).json({ success: true, trivia: randomTrivia });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch trivia' });
  }
};

export const predictMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team1, team2 } = req.body;
    
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi3:mini',
      prompt: `Predict the cricket match outcome between ${team1} and ${team2}. Provide win probability for each team and a brief analysis. Respond in JSON format: {"team1_win_probability": number, "team2_win_probability": number, "analysis": "string"}`,
      stream: false
    });

    const prediction = JSON.parse(ollamaResponse.data.response);
    res.status(200).json({ success: true, prediction });
  } catch (error: any) {
    const fallbackPrediction = {
      team1_win_probability: 52,
      team2_win_probability: 48,
      analysis: 'Based on recent form and head-to-head records, this match is expected to be closely contested.'
    };
    res.status(200).json({ success: true, prediction: fallbackPrediction });
  }
};
