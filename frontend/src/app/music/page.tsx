'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Search, Heart, Plus } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

export default function MusicPage() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await api.get('/music/trending');
      setSongs(res.data.songs.map((item: any) => item.track));
    } catch (error) {
      toast.error('Failed to load music');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(`/music/search?query=${searchQuery}`);
      setSongs(res.data.songs);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const playTrack = (track: any) => {
    if (track.preview_url) {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.play();
      }
    } else {
      toast.error('Preview not available');
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const saveToVault = async (track: any) => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    try {
      await api.post('/vault/save', {
        type: 'playlist',
        contentData: {
          title: track.name,
          url: track.external_urls?.spotify,
          description: track.artists?.[0]?.name,
          imageUrl: track.album?.images?.[0]?.url
        }
      });
      toast.success('Saved to vault!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-8">Music Hub</h1>

      <div className="glass-strong p-4 rounded-xl mb-8 flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search songs, artists, albums..."
          className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-white/40"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {songs.map((track: any, idx) => (
          <motion.div
            key={track.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
          >
            {track.album?.images?.[0] && (
              <div className="relative aspect-square">
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => playTrack(track)}
                    className="w-16 h-16 rounded-full bg-neon-blue flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-white line-clamp-1 mb-1">{track.name}</h3>
              <p className="text-sm text-white/60 line-clamp-1">
                {track.artists?.map((a: any) => a.name).join(', ')}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => saveToVault(track)}
                  className="flex-1 px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/10 p-4 z-50">
          <div className="container mx-auto flex items-center gap-4">
            {currentTrack.album?.images?.[0] && (
              <div className="relative w-14 h-14 rounded">
                <Image
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.name}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-white line-clamp-1">{currentTrack.name}</div>
              <div className="text-sm text-white/60 line-clamp-1">
                {currentTrack.artists?.map((a: any) => a.name).join(', ')}
              </div>
            </div>
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
