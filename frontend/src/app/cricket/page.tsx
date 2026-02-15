'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, Lightbulb, Zap } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { CricketMatch, Ranking, Trivia, Prediction } from '@/types/cricket';
import LiveMatches from '@/components/cricket/LiveMatches';
import Schedule from '@/components/cricket/Schedule';
import Rankings from '@/components/cricket/Rankings';
import TriviaSection from '@/components/cricket/TriviaSection';
import PredictSection from '@/components/cricket/PredictSection';

type Tab = 'live' | 'schedule' | 'rankings' | 'trivia' | 'predict';

export default function CricketPage() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [liveMatches, setLiveMatches] = useState<CricketMatch[]>([]);
  const [schedule, setSchedule] = useState<CricketMatch[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [rankingFormat, setRankingFormat] = useState<'test' | 'odi' | 't20'>('test');
  const [trivia, setTrivia] = useState<Trivia | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab, rankingFormat]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'live') {
        const res = await api.get('/cricket/live');
        setLiveMatches(res.data.matches || []);
      } else if (activeTab === 'schedule') {
        const res = await api.get('/cricket/schedule');
        setSchedule(res.data.matches || []);
      } else if (activeTab === 'rankings') {
        const res = await api.get(`/cricket/rankings?format=${rankingFormat}`);
        setRankings(res.data.rankings || []);
      } else if (activeTab === 'trivia') {
        if (!trivia) {
          const res = await api.get('/cricket/trivia');
          setTrivia(res.data.trivia);
        }
      }
    } catch (error) {
      toast.error('No live matches at the moment - Check back later!');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewTrivia = async () => {
    try {
      const res = await api.get('/cricket/trivia');
      setTrivia(res.data.trivia);
    } catch (error) {
      toast.error('Failed to fetch trivia');
    }
  };

  const tabs = [
    { id: 'live' as Tab, label: 'Live', icon: Trophy },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
    { id: 'rankings' as Tab, label: 'Rankings', icon: TrendingUp },
    { id: 'trivia' as Tab, label: 'Trivia', icon: Lightbulb },
    { id: 'predict' as Tab, label: 'Predict', icon: Zap },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Cricket Hub</h1>
      <p className="text-white/60 text-center">Stay updated with live scores, fixtures, rankings and cricket insights</p>
      <p className="text-xs text-white/60 mt-2 text-center">
          ⚠️Some data may be limited due to official licensing</p>
      <div className="flex justify-center flex-wrap gap-3 mt-8 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'glass text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading && activeTab !== 'trivia' && activeTab !== 'predict' ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {activeTab === 'live' && <LiveMatches matches={liveMatches} />}
          
          {activeTab === 'schedule' && <Schedule matches={schedule} />}
          
          {activeTab === 'rankings' && (
            <Rankings 
              rankings={rankings} 
              format={rankingFormat}
              onFormatChange={setRankingFormat}
            />
          )}
          
          {activeTab === 'trivia' && (
            <TriviaSection 
              trivia={trivia} 
              onNewQuestion={fetchNewTrivia}
            />
          )}
          
          {activeTab === 'predict' && (
            <PredictSection 
              schedule={schedule}
              prediction={prediction}
              onPredict={setPrediction}
            />
          )}
        </>
      )}
    </div>
  );
}
