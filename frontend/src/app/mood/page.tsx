'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { MoodResult } from '@/types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function MoodPage() {
  const [text, setText] = useState('');
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const analyzeMood = async () => {
    if (!text.trim() || text.length < 10) {
      toast.error('Please enter at least 10 characters');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to analyze mood');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/mood/analyze-text', { text });
      setMoodResult(response.data.data);
      toast.success('Mood analyzed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const saveToVault = async () => {
    if (!moodResult) return;

    try {
      await api.post('/vault/save', {
        type: 'mood',
        contentData: {
          mood: moodResult.mood,
          description: moodResult.explanation,
          metadata: { intensity: moodResult.intensity, emoji: moodResult.emoji },
        },
      });
      toast.success('Mood saved to vault!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-heading font-bold glow-text mb-4">
            Mood Detector
          </h1>
          <p className="text-xl text-white/70">
            AI-powered emotional analysis from your text
          </p>
        </motion.div>

        <div className="glass-strong p-8 rounded-2xl border border-neon-blue/30 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              How are you feeling? Share your thoughts...
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write about your day, feelings, or anything on your mind..."
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all resize-none"
            />
            <div className="text-right text-sm text-white/40 mt-1">
              {text.length} characters
            </div>
          </div>

          <button
            onClick={analyzeMood}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-heading font-semibold hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="spinner w-5 h-5 border-2" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Mood</span>
              </>
            )}
          </button>
        </div>

        {moodResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 glass-strong p-8 rounded-2xl border-2"
            style={{
              borderColor: moodResult.color,
              boxShadow: `0 0 30px ${moodResult.color}40`,
            }}
          >
            <div className="text-center space-y-6">
              <div className="text-6xl">{moodResult.emoji}</div>
              
              <div>
                <h3 className="text-3xl font-heading font-bold capitalize mb-2">
                  {moodResult.mood}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
                  <span>Intensity:</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-8 rounded-full ${
                          i < moodResult.intensity ? 'opacity-100' : 'opacity-20'
                        }`}
                        style={{
                          backgroundColor: moodResult.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-lg">{moodResult.explanation}</p>

              <button
                onClick={saveToVault}
                className="px-6 py-3 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-all font-medium"
              >
                Save to Vault
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
