import { Request, Response } from 'express';
import axios from 'axios';

const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

export const getDailyHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    if (!zodiacSigns.includes(sign.toLowerCase())) {
      res.status(400).json({ success: false, message: 'Invalid zodiac sign' });
      return;
    }

    const horoscopes: any = {
      aries: "Today brings exciting opportunities! Your energy is contagious. Embrace new challenges and trust your instincts.",
      taurus: "Focus on self-care today. Financial prospects look good. Trust the process and stay grounded.",
      gemini: "Communication is key today. Share your ideas freely. A creative project may take off!",
      cancer: "Emotional balance is important. Spend time with loved ones. Your intuition is strong right now.",
      leo: "Your confidence shines bright! Leadership opportunities await. Step into the spotlight with pride.",
      virgo: "Details matter today. Organization brings peace. A health breakthrough may surprise you.",
      libra: "Harmony in relationships is favored. Diplomacy wins. Balance work and play effectively.",
      scorpio: "Intensity serves you well. Dive deep into passions. Transformation is on the horizon.",
      sagittarius: "Adventure calls! Expand your horizons. Learning something new brings joy.",
      capricorn: "Hard work pays off. Career moves are favored. Stay patient and persistent.",
      aquarius: "Innovation is your superpower today. Think outside the box. Social connections flourish.",
      pisces: "Creativity flows abundantly. Trust your dreams. Compassion opens new doors."
    };

    res.status(200).json({ 
      success: true, 
      horoscope: {
        sign,
        date: new Date().toISOString().split('T')[0],
        prediction: horoscopes[sign.toLowerCase()],
        luckyNumber: Math.floor(Math.random() * 100),
        luckyColor: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'][Math.floor(Math.random() * 5)]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch horoscope' });
  }
};

export const getCompatibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign1, sign2 } = req.query;

    if (!zodiacSigns.includes((sign1 as string).toLowerCase()) || !zodiacSigns.includes((sign2 as string).toLowerCase())) {
      res.status(400).json({ success: false, message: 'Invalid zodiac signs' });
      return;
    }

    const score = Math.floor(Math.random() * 30) + 70;
    const analysis = score > 85 
      ? "Amazing match! Your energies align perfectly."
      : score > 70 
      ? "Great compatibility! With understanding, this can thrive."
      : "Good potential! Communication will strengthen this bond.";

    res.status(200).json({ 
      success: true, 
      compatibility: {
        sign1,
        sign2,
        score,
        analysis
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to calculate compatibility' });
  }
};

export const getZodiacInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    const zodiacInfo: any = {
      aries: { element: 'Fire', ruling_planet: 'Mars', dates: 'Mar 21 - Apr 19' },
      taurus: { element: 'Earth', ruling_planet: 'Venus', dates: 'Apr 20 - May 20' },
      gemini: { element: 'Air', ruling_planet: 'Mercury', dates: 'May 21 - Jun 20' },
      cancer: { element: 'Water', ruling_planet: 'Moon', dates: 'Jun 21 - Jul 22' },
      leo: { element: 'Fire', ruling_planet: 'Sun', dates: 'Jul 23 - Aug 22' },
      virgo: { element: 'Earth', ruling_planet: 'Mercury', dates: 'Aug 23 - Sep 22' },
      libra: { element: 'Air', ruling_planet: 'Venus', dates: 'Sep 23 - Oct 22' },
      scorpio: { element: 'Water', ruling_planet: 'Pluto', dates: 'Oct 23 - Nov 21' },
      sagittarius: { element: 'Fire', ruling_planet: 'Jupiter', dates: 'Nov 22 - Dec 21' },
      capricorn: { element: 'Earth', ruling_planet: 'Saturn', dates: 'Dec 22 - Jan 19' },
      aquarius: { element: 'Air', ruling_planet: 'Uranus', dates: 'Jan 20 - Feb 18' },
      pisces: { element: 'Water', ruling_planet: 'Neptune', dates: 'Feb 19 - Mar 20' }
    };

    res.status(200).json({ success: true, info: zodiacInfo[sign.toLowerCase()] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch zodiac info' });
  }
};
