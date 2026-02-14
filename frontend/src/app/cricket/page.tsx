'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, Lightbulb, Zap } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CricketPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [liveMatches, setLiveMatches] = useState([]);
  const [rankings, setRankings] = useState<any>(null);
  const [schedule, setSchedule] = useState([]);
  const [trivia, setTrivia] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'live') {
        const res = await api.get('/cricket/live-scores');
        setLiveMatches(res.data.matches || []);
      } else if (activeTab === 'rankings') {
        const res = await api.get('/cricket/rankings');
        setRankings(res.data.rankings);
      } else if (activeTab === 'schedule') {
        const res = await api.get('/cricket/schedule');
        setSchedule(res.data.schedule || []);
      } else if (activeTab === 'trivia') {
        const res = await api.get('/cricket/trivia');
        setTrivia(res.data.trivia);
      }
    } catch (error) {
      toast.error('Failed to load cricket data');
    } finally {
      setLoading(false);
    }
  };

  const predictMatch = async () => {
    try {
      const res = await api.post('/cricket/predict', {
        team1: 'India',
        team2: 'Australia'
      });
      setPrediction(res.data.prediction);
      toast.success('Prediction generated!');
    } catch (error) {
      toast.error('Prediction failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-8">Cricket Hub</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {['live', 'rankings', 'schedule', 'trivia', 'predict'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'glass text-white/70 hover:bg-white/10'
            }`}
          >
            {tab === 'live' && <Trophy className="w-4 h-4 inline mr-2" />}
            {tab === 'rankings' && <TrendingUp className="w-4 h-4 inline mr-2" />}
            {tab === 'schedule' && <Calendar className="w-4 h-4 inline mr-2" />}
            {tab === 'trivia' && <Lightbulb className="w-4 h-4 inline mr-2" />}
            {tab === 'predict' && <Zap className="w-4 h-4 inline mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {activeTab === 'live' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match: any, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong p-6 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-neon-green">{match.matchType}</span>
                    {match.status && <span className="text-xs text-white/50">{match.status}</span>}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{match.t1 || match.teamInfo?.[0]?.name}</span>
                      <span className="text-lg font-bold text-neon-blue">{match.t1s}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{match.t2 || match.teamInfo?.[1]?.name}</span>
                      <span className="text-lg font-bold text-neon-purple">{match.t2s}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'rankings' && rankings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['test', 'odi', 't20'].map((format) => (
                <div key={format} className="glass-strong p-6 rounded-xl">
                  <h3 className="text-xl font-heading font-bold mb-4 uppercase">{format}</h3>
                  <div className="space-y-3">
                    {rankings[format].map((team: any) => (
                      <div key={team.rank} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-sm font-bold">
                            {team.rank}
                          </span>
                          <span>{team.team}</span>
                        </div>
                        <span className="text-neon-purple font-bold">{team.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trivia' && trivia && (
            <div className="glass-strong p-8 rounded-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold mb-4 text-neon-blue">Cricket Trivia</h3>
              <p className="text-lg mb-6">{trivia.question}</p>
              <div className="p-4 bg-neon-purple/20 rounded-lg border border-neon-purple/30">
                <p className="font-semibold text-neon-purple">{trivia.answer}</p>
              </div>
              <button
                onClick={fetchData}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-medium"
              >
                Next Question
              </button>
            </div>
          )}

          {activeTab === 'predict' && (
            <div className="glass-strong p-8 rounded-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold mb-6 text-center">AI Match Predictor</h3>
              <button
                onClick={predictMatch}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-heading font-semibold mb-6"
              >
                <Zap className="w-5 h-5 inline mr-2" />
                Predict India vs Australia
              </button>
              {prediction && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 glass rounded-lg text-center">
                      <div className="text-3xl font-bold text-neon-blue mb-2">
                        {prediction.team1_win_probability}%
                      </div>
                      <div className="text-sm text-white/70">India</div>
                    </div>
                    <div className="p-4 glass rounded-lg text-center">
                      <div className="text-3xl font-bold text-neon-purple mb-2">
                        {prediction.team2_win_probability}%
                      </div>
                      <div className="text-sm text-white/70">Australia</div>
                    </div>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <p className="text-white/80">{prediction.analysis}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
