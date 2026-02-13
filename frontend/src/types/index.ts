export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface MoodResult {
  mood: string;
  intensity: number;
  explanation: string;
  color: string;
  emoji: string;
}

export interface Meme {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
  preview: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  external_urls: { spotify: string };
  tracks: { total: number };
}

export interface CricketMatch {
  id: number;
  team1: string;
  team2: string;
  team1Score: string;
  team2Score: string;
  status: string;
  isLive: boolean;
}

export interface Wallpaper {
  id: number;
  url: string;
  thumbnail: string;
  mood: string;
  author: string;
}

export interface SavedContent {
  _id: string;
  userId: string;
  type: 'meme' | 'playlist' | 'quote' | 'mood' | 'wallpaper';
  contentData: {
    title?: string;
    url?: string;
    description?: string;
    mood?: string;
    imageUrl?: string;
    metadata?: any;
  };
  createdAt: string;
}

export interface Poll {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  question: string;
  options: {
    text: string;
    votes: number;
    voters: string[];
    _id: string;
  }[];
  expiresAt?: string;
  createdAt: string;
}

export interface FashionSuggestion {
  name: string;
  description: string;
  items: string[];
  vibe: string;
}
