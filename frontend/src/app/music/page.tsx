'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Heart, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Track, SavedTrack } from '@/types/music';
import { useMusicStore } from '@/store/musicStore';
import { useAuthStore } from '@/store/authStore';
import MusicPlayer from '@/components/music/MusicPlayer';

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'saved'>('trending');
  const [hoveredTrack, setHoveredTrack] = useState<string | number | null>(null);

  const { setCurrentTrack, currentTrack, recentlyPlayed } = useMusicStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchTrending();
    if (isAuthenticated) {
      fetchSaved();
    }
  }, [isAuthenticated]);

  const fetchTrending = async () => {
    try {
      const res = await api.get('/api/music/trending');
      setTrendingTracks(res.data.tracks);
    } catch (error) {
      toast.error('Failed to load trending music');
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await api.get('/api/music/saved');
      setSavedTracks(res.data.tracks);
    } catch (error) {
      console.error('Failed to load saved music');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setActiveTab('search');
    try {
      const res = await api.get(`/api/music/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.tracks);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleSaveTrack = async (track: Track) => {
    if (!isAuthenticated) {
      toast.error('Please login to save tracks');
      return;
    }

    try {
      await api.post('/api/music/save', {
        trackId: track.id.toString(),
        title: track.title,
        artist: track.artist,
        album: track.album,
        cover: track.cover,
        preview: track.preview,
        duration: track.duration
      });
      toast.success('Track saved!');
      fetchSaved();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleRemoveTrack = async (id: string) => {
    try {
      await api.delete(`/api/music/saved/${id}`);
      toast.success('Track removed!');
      fetchSaved();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTracks =
    activeTab === 'search'
      ? searchResults
      : activeTab === 'trending'
      ? trendingTracks
      : savedTracks;

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Music</h1>
          <p className="text-white/60 text-center">Discover and play millions of songs</p>
          <p className="text-xs text-white/60 mt-2 text-center">
          ⚠️Only preview clips are available due to copyright and licensing restrictions</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple'
                : 'glass hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Trending
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple'
                  : 'glass hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
              Search Results
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => {
                setActiveTab('saved');
                fetchSaved();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple'
                  : 'glass hover:bg-white/10'
              }`}
            >
              <Heart className="w-5 h-5" />
              Saved ({savedTracks.length})
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="glass-strong p-4 rounded-xl mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search songs, artists, albums..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Recently Played</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentlyPlayed.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.05 }}
                  className="glass p-4 rounded-xl min-w-[180px] cursor-pointer group"
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={track.coverMedium || track.cover}
                      alt={track.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="font-semibold text-sm truncate">{track.title}</div>
                  <div className="text-xs text-white/60 truncate">{track.artist}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="glass-strong rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-heading font-bold">
              {activeTab === 'search'
                ? `Results (${searchResults.length})`
                : activeTab === 'trending'
                ? 'Top Trending'
                : 'Your Library'}
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {displayTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                className={`p-4 hover:bg-white/5 transition-all cursor-pointer group ${
                  currentTrack?.id === track.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Number/Play Button */}
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {hoveredTrack === track.id ? (
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="w-8 h-8 rounded-full bg-neon-blue flex items-center justify-center"
                      >
                        <Play className="w-4 h-4" fill="white" />
                      </button>
                    ) : (
                      <span className="text-white/60 font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Cover */}
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={track.coverSmall || track.cover}
                      alt={track.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{track.title}</div>
                    <div className="text-sm text-white/60 truncate">{track.artist}</div>
                  </div>

                  {/* Album */}
                  <div className="hidden md:block flex-1 min-w-0">
                    <div className="text-sm text-white/60 truncate">{track.album}</div>
                  </div>

                  {/* Duration */}
                  <div className="hidden sm:flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(track.duration)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {activeTab === 'saved' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTrack((track as SavedTrack)._id);
                        }}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      >
                        <Heart className="w-5 h-5" fill="currentColor" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTrack(track);
                        }}
                        className="p-2 hover:bg-pink-500/20 text-pink-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {displayTracks.length === 0 && !loading && (
            <div className="p-12 text-center text-white/60">
              {activeTab === 'search'
                ? 'No results found. Try a different search.'
                : activeTab === 'saved'
                ? 'No saved tracks yet. Start saving your favorites!'
                : 'Loading trending music...'}
            </div>
          )}
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
