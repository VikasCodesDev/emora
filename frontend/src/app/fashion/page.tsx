'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function FashionPage() {
  const [outfits, setOutfits] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchOutfits();
    fetchTrendingItems();
  }, []);

  const fetchOutfits = async () => {
    try {
      const res = await api.get('/api/fashion/outfits');
      setOutfits(res.data.outfits);
    } catch (error) {
      toast.error('Failed to load outfits');
    }
  };

  const fetchTrendingItems = async () => {
    try {
      const res = await api.get('/api/fashion/trending');
      setTrendingItems(res.data.items);
    } catch (error) {
      console.error('Trending items error');
    }
  };

  const saveToVault = async (outfit: any) => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    try {
      await api.post('/api/vault/save', {
        type: 'wallpaper',
        contentData: {
          title: outfit.title,
          description: `${outfit.celebrity} - ${outfit.style}`,
          imageUrl: outfit.imageUrl,
          metadata: { items: outfit.items, price: outfit.price }
        }
      });
      toast.success('Saved to vault!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Fashion Hub</h1>
      <p className="text-white/60 text-center">Explore trending looks, aesthetics, and your next style upgrade</p>

      <div className="glass-strong p-6 rounded-xl mt-6 mb-8">
        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-neon-pink" />
          Trending Items
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trendingItems.map((item: any, idx) => (
            <div key={idx} className="glass p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-neon-purple mb-1">{item.popularity}%</div>
              <div className="font-semibold mb-1">{item.name}</div>
              <div className="text-xs text-white/50 capitalize">{item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-heading font-bold mb-6">Celebrity Outfits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((outfit: any, idx) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={outfit.imageUrl}
                alt={outfit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => saveToVault(outfit)}
                  className="p-3 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{outfit.title}</h3>
              <p className="text-sm text-neon-blue mb-3">{outfit.celebrity}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {outfit.items.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">{outfit.price}</span>
                <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-xs capitalize">
                  {outfit.style}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
