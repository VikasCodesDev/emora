'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function WallpapersPage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [category, setCategory] = useState('nature');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchWallpapers();
  }, [category]);

  const fetchWallpapers = async () => {
    try {
      const res = await api.get(`/api/wallpapers?category=${category}`);
      setWallpapers(res.data.wallpapers);
    } catch (error) {
      toast.error('Failed to load wallpapers');
    }
  };

  const saveToVault = async (wallpaper: any) => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    try {
      await api.post('/api/vault/save', {
        type: 'wallpaper',
        contentData: {
          title: wallpaper.description || 'Wallpaper',
          url: wallpaper.fullUrl,
          imageUrl: wallpaper.url,
          description: `By ${wallpaper.author}`
        }
      });
      toast.success('Saved!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Wallpapers</h1>
      <p className="text-white/60 text-center">Visuals that transform your device into art</p>
      <div className="flex justify-center gap-3 mt-8 mb-8 flex-wrap">
        {['nature', 'abstract', 'minimal', 'space', 'city', 'anime'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg capitalize ${
              category === cat ? 'bg-gradient-to-r from-neon-blue to-neon-purple' : 'glass'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {wallpapers.map((wp: any, idx) => (
          <motion.div
            key={wp.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="break-inside-avoid mb-6 group relative"
          >
            <img src={wp.url} alt={wp.description} className="w-full rounded-xl" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <a
                href={wp.fullUrl}
                download
                className="p-3 bg-neon-blue rounded-lg"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={() => saveToVault(wp)}
                className="p-3 bg-pink-500 rounded-lg"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
