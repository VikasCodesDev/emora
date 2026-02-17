'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Send, ThumbsUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const res = await api.get('/api/challenge/daily');
      setChallenge(res.data.challenge);
      if (res.data.challenge._id) {
        fetchLeaderboard(res.data.challenge._id);
      }
    } catch (error) {
      toast.error('Failed to load challenge');
    }
  };

  const fetchLeaderboard = async (challengeId: string) => {
    try {
      const res = await api.get(`/api/challenge/leaderboard/${challengeId}`);
      setLeaderboard(res.data.leaderboard);
    } catch (error) {
      console.error('Leaderboard error:', error);
    }
  };

  const submit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    if (!response.trim()) {
      toast.error('Please write a response');
      return;
    }
    try {
      await api.post('/api/challenge/submit', {
        challengeId: challenge._id,
        response
      });
      toast.success('Submitted!');
      setResponse('');
      fetchChallenge();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  const voteSubmission = async (index: number) => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    try {
      await api.post('/api/challenge/vote', {
        challengeId: challenge._id,
        submissionIndex: index
      });
      toast.success('Vote recorded!');
      fetchChallenge();
    } catch (error) {
      toast.error('Vote failed');
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Challenge</h1>
      <p className="text-white/60 text-center">Step out of your comfort zone today</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-8 rounded-2xl mt-6 mb-8"
      >
        <h2 className="text-3xl font-heading font-bold text-neon-blue mb-4">
          {challenge.title}
        </h2>
        <p className="text-xl text-white/80 mb-6">{challenge.description}</p>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Share your response..."
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg mb-4"
        />

        <button
          onClick={submit}
          className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center gap-2 font-heading font-semibold"
        >
          <Send className="w-5 h-5" />
          Submit Response
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-strong p-6 rounded-xl">
          <h3 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Leaderboard
          </h3>
          <div className="space-y-3">
            {leaderboard.map((sub: any, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 glass rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <span>{sub.userId?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-neon-purple" />
                  <span className="font-bold">{sub.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong p-6 rounded-xl">
          <h3 className="text-2xl font-heading font-bold mb-4">Top Submissions</h3>
          <div className="space-y-4">
            {challenge.submissions?.slice(0, 5).map((sub: any, idx: number) => (
              <div key={idx} className="p-4 glass rounded-lg">
                <p className="text-white/80 mb-3">{sub.response}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">
                    {sub.userId?.name || 'Anonymous'}
                  </span>
                  <button
                    onClick={() => voteSubmission(idx)}
                    className="px-3 py-1 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple rounded-lg flex items-center gap-1 text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {sub.score}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
