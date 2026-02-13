import { Request, Response } from 'express';
import axios from 'axios';

// Replace with your real cricket API
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

// ================= LIVE MATCHES =================
export const getLiveMatches = async (_req: Request, res: Response) => {
  try {
    // Replace with real API call
    const data = [
      { team1: "India", team2: "Australia", score: "210/3 (32 overs)" },
      { team1: "England", team2: "Pakistan", score: "145/6 (25 overs)" }
    ];

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= RANKINGS =================
export const getRankings = async (_req: Request, res: Response) => {
  try {
    const data = [
      { team: "India", points: 125 },
      { team: "Australia", points: 120 },
      { team: "England", points: 115 }
    ];

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= SCHEDULE =================
export const getSchedule = async (_req: Request, res: Response) => {
  try {
    const data = [
      { match: "India vs NZ", date: "25 Jan 2026" },
      { match: "Australia vs SA", date: "28 Jan 2026" }
    ];

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= TRIVIA =================
export const getTrivia = async (_req: Request, res: Response) => {
  try {
    const data = "Sachin Tendulkar has the most international centuries in cricket history.";
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= AI PREDICTOR =================
export const predictMatch = async (req: Request, res: Response) => {
  try {
    const { team1, team2 } = req.body;

    const prediction = `${team1} has a 60% chance of winning against ${team2}.`;

    res.json({
      success: true,
      data: {
        team1,
        team2,
        prediction
      }
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
