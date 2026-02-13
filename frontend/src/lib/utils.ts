import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    happy: '#FFD700',
    sad: '#4169E1',
    anxious: '#FF6B6B',
    excited: '#FF69B4',
    calm: '#87CEEB',
    angry: '#DC143C',
    confused: '#9370DB',
    nostalgic: '#DAA520',
    hopeful: '#32CD32',
    stressed: '#FF8C00',
  };
  return moodColors[mood.toLowerCase()] || '#00f0ff';
};

export const getMoodEmoji = (mood: string): string => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    excited: '🤩',
    calm: '😌',
    angry: '😠',
    confused: '😕',
    nostalgic: '🥺',
    hopeful: '🌟',
    stressed: '😫',
  };
  return moodEmojis[mood.toLowerCase()] || '😐';
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getGradientByMood = (mood: string): string => {
  const gradients: Record<string, string> = {
    happy: 'from-yellow-400 via-orange-400 to-pink-400',
    sad: 'from-blue-400 via-indigo-500 to-purple-600',
    anxious: 'from-red-400 via-pink-500 to-purple-500',
    excited: 'from-pink-400 via-rose-400 to-red-500',
    calm: 'from-blue-300 via-cyan-400 to-teal-400',
    angry: 'from-red-500 via-rose-600 to-pink-700',
    confused: 'from-purple-400 via-violet-500 to-indigo-500',
    nostalgic: 'from-amber-400 via-yellow-500 to-orange-500',
    hopeful: 'from-green-400 via-emerald-500 to-teal-500',
    stressed: 'from-orange-500 via-red-500 to-pink-600',
  };
  return gradients[mood.toLowerCase()] || 'from-cyan-400 via-purple-500 to-pink-500';
};
