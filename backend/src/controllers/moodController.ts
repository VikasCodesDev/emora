import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';


// ================= TEXT MOOD =================
export const analyzeTextMood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'Please provide text with at least 10 characters',
      });
      return;
    }

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi3:mini',
      prompt: `
Return ONLY valid JSON.
No explanation outside JSON.
No markdown.
No text before or after JSON.

Analyze the mood of this text:

"${text}"

Respond in this exact JSON structure:

{
  "mood": "happy or sad or anxious or excited or calm or angry or confused or nostalgic or hopeful or stressed",
  "intensity": number between 1 and 10,
  "explanation": "short explanation",
  "color": "hex color",
  "emoji": "single emoji"
}
      `,
      stream: false
    });

    let moodData;
    const raw = response.data.response;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        moodData = JSON.parse(jsonMatch[0]);
      } catch {
        moodData = null;
      }
    }

    if (!moodData) {
      moodData = {
        mood: "neutral",
        intensity: 5,
        explanation: "AI returned invalid format.",
        color: "#888888",
        emoji: "😐"
      };
    }

    res.status(200).json({
      success: true,
      data: {
        ...moodData,
        analyzedText:
          text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      },
    });

  } catch (error: any) {
    console.error('Mood analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing mood',
    });
  }
};



// ================= IMAGE MOOD =================
export const analyzeImageMood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { imageDescription } = req.body;

    if (!imageDescription) {
      res.status(400).json({
        success: false,
        message: 'Please provide an image description',
      });
      return;
    }

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi3:mini',
      prompt: `
Return ONLY valid JSON.
No explanation outside JSON.
No markdown.
No text before or after JSON.

Analyze the mood of this image description:

"${imageDescription}"

Respond in this exact JSON structure:

{
  "mood": "happy or sad or anxious or excited or calm or angry or confused or nostalgic or hopeful or stressed",
  "intensity": number between 1 and 10,
  "explanation": "short explanation",
  "color": "hex color",
  "emoji": "single emoji"
}
      `,
      stream: false
    });

    let moodData;
    const raw = response.data.response;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        moodData = JSON.parse(jsonMatch[0]);
      } catch {
        moodData = null;
      }
    }

    if (!moodData) {
      moodData = {
        mood: "neutral",
        intensity: 5,
        explanation: "AI returned invalid format.",
        color: "#888888",
        emoji: "😐"
      };
    }

    res.status(200).json({
      success: true,
      data: moodData,
    });

  } catch (error: any) {
    console.error('Image mood analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing image mood',
    });
  }
};
