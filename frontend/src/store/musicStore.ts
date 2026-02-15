import { create } from 'zustand';
import { Track } from '@/types/music';

interface MusicState {
  currentTrack: Track | null;
  isPlaying: boolean;
  recentlyPlayed: Track[];
  volume: number;
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  addToRecentlyPlayed: (track: Track) => void;
  setVolume: (volume: number) => void;
  clearCurrentTrack: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  volume: 70,

  setCurrentTrack: (track) => {
    const state = get();
    set({ currentTrack: track, isPlaying: true });
    state.addToRecentlyPlayed(track);
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  addToRecentlyPlayed: (track) =>
    set((state) => {
      const exists = state.recentlyPlayed.find((t) => t.id === track.id);
      if (exists) return state;

      const newRecent = [track, ...state.recentlyPlayed].slice(0, 10);
      return { recentlyPlayed: newRecent };
    }),

  setVolume: (volume) => set({ volume }),

  clearCurrentTrack: () => set({ currentTrack: null, isPlaying: false }),
}));
