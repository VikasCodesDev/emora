'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Copy, Heart } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function QuotesPage() {
  const [quote, setQuote] = useState<any>(null);
  const [category, setCategory] = useState('motivational');
  const [generating, setGenerating] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchQuote();
  }, [category]);

  const fetchQuote = async () => {
    try {
      const res = await api.get(`/quotes/random?category=${category}`);
      setQuote(res.data.quote);
    } catch (error) {
      toast.error('Failed to load quote');
    }
  };

  const generateAiQuote = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use AI generation');
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post('/quotes/generate', { topic: category });
      setQuote(res.data.quote);
      toast.success('AI quote generated!');
    } catch (error) {
      toast.error('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    toast.success('Copied to clipboard!');
  };

  const saveToVault = async () => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    try {
      await api.post('/vault/save', {
        type: 'quote',
        contentData: {
          title: quote.text,
          description: `- ${quote.author}`,
        }
      });
      toast.success('Saved to vault!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Daily Quotes</h1>
      <p className="text-white/60 text-center">Quotes that resonate with your vibe</p>

      <div className="flex gap-3 justify-center mt-8 mb-8 flex-wrap">
        {['motivational', 'life', 'success', 'work'].map((cat) => (
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

      {quote && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong p-12 rounded-2xl max-w-3xl mx-auto text-center"
        >
          <p className="text-3xl font-heading text-white mb-6 leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xl text-neon-blue mb-8">- {quote.author}</p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={fetchQuote}
              className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New Quote
            </button>
            <button
              onClick={generateAiQuote}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg flex items-center gap-2"
            >
              {generating ? (
                <div className="spinner w-5 h-5 border-2" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              AI Generate
            </button>
            <button
              onClick={copyQuote}
              className="px-6 py-3 glass rounded-lg flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              Copy
            </button>
            <button
              onClick={saveToVault}
              className="px-6 py-3 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Save
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
