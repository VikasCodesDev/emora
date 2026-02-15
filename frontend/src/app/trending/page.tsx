'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function TrendingPage() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    try {
      const res = await api.get(`/trending/news?category=${category}`);
      setNews(res.data.news);
    } catch (error) {
      toast.error('Failed to load news');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Trending News</h1>
      <p className="text-white/60 text-center">What the world is talking about right now</p>
      <div className="flex justify-center gap-3 mt-8 mb-8 flex-wrap">
        {['general', 'technology', 'entertainment', 'sports', 'business'].map((cat) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article: any, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
          >
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <h3 className="font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-white/60 mb-4 line-clamp-3">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors"
            >
              Read More <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
