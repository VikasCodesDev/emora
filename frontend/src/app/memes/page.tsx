'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Heart, Download } from 'lucide-react';
import api from '@/lib/api';
import { Meme } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCaption, setGeneratingCaption] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
  setLoading(true);

  try {
    const response = await api.get('/api/content/memes?limit=20');

    console.log("Memes API Response:", response.data);

    if (Array.isArray(response.data)) {
      setMemes(response.data);
    } else if (response.data && Array.isArray(response.data.memes)) {
      setMemes(response.data.memes);
    } else {
      setMemes([]);
    }

  } catch (error) {
    console.error("Fetch Memes Error:", error);
    setMemes([]);
    toast.error('Failed to fetch memes');
  } finally {
    setLoading(false);
  }
};

  const generateCaption = async (meme: Meme) => {
    if (!isAuthenticated) {
      toast.error('Please login to generate captions');
      return;
    }

    setGeneratingCaption(meme.postLink);
    try {
      const response = await api.post('/api/content/memes/caption', {
        memeUrl: meme.url,
        memeTitle: meme.title,
      });
      setCaptions({ ...captions, [meme.postLink]: response.data.caption });
      toast.success('Caption generated!');
    } catch (error) {
      toast.error('Failed to generate caption');
    } finally {
      setGeneratingCaption(null);
    }
  };

  const saveToVault = async (meme: Meme) => {
    if (!isAuthenticated) {
      toast.error('Please login to save memes');
      return;
    }

    try {
      await api.post('/vault/save', {
        type: 'meme',
        contentData: {
          title: meme.title,
          url: meme.url,
          imageUrl: meme.url,
          description: captions[meme.postLink] || '',
        },
      });
      toast.success('Saved to vault!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold glow-text mb-2">
              Fresh Memes
            </h1>
            <p className="text-white/60">AI-powered caption generation</p>
          </div>
          <button
            onClick={fetchMemes}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Memes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(memes) && memes.length > 0 && memes.map((meme, index) => (
            <motion.div
              key={meme.postLink}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group glass rounded-xl overflow-hidden hover:bg-white/10 transition-all hover-lift"
            >
              {/* Image */}
              <div className="relative aspect-square bg-black/20">
                <Image
                  src={meme.url}
                  alt={meme.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-white line-clamp-2">
                  {meme.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-white/50">
                  <span>r/{meme.subreddit}</span>
                  <span>↑ {meme.ups}</span>
                </div>

                {/* AI Caption */}
                {captions[meme.postLink] && (
                  <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                    <p className="text-sm text-white/90 italic">
                      "{captions[meme.postLink]}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => generateCaption(meme)}
                    disabled={generatingCaption === meme.postLink}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple rounded-lg transition-all disabled:opacity-50"
                  >
                    {generatingCaption === meme.postLink ? (
                      <div className="spinner w-4 h-4 border-2" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">AI Caption</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => saveToVault(meme)}
                    className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-all"
                    title="Save to vault"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <a
                    href={meme.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
