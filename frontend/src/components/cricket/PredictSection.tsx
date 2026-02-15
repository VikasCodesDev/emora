'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { CricketMatch, Prediction } from '@/types/cricket';
import { getTeamFlag } from '@/lib/cricketUtils';

interface Props {
  schedule: CricketMatch[];
  prediction: Prediction | null;
  onPredict: (prediction: Prediction) => void;
}

export default function PredictSection({ schedule, prediction, onPredict }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [predicting, setPredicting] = useState(false);

  const handlePredict = async () => {
    if (!selectedMatch) {
      toast.error('Please select a match');
      return;
    }

    setPredicting(true);
    try {
      const res = await api.post('/cricket/predict', { matchId: selectedMatch });
      onPredict(res.data.prediction);
      toast.success('Prediction generated!');
    } catch (error) {
      toast.error('Unable to generate prediction right now - Please try again later');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-strong p-8 rounded-2xl mb-6">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-neon-purple" />
          AI Match Predictor
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Select Match</label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-blue"
          >
            <option value="">Choose a match...</option>
            {schedule.slice(0, 10).map((match) => (
              <option key={match.id} value={match.id}>
                {match.name} - {match.matchType}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePredict}
          disabled={!selectedMatch || predicting}
          className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-heading font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {predicting ? (
            <>
              <div className="spinner w-5 h-5 border-2" />
              Predicting...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Prediction
            </>
          )}
        </button>
      </div>

      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-strong p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">{getTeamFlag(prediction.team1.name)}</div>
                <div className="font-bold text-xl mb-2">{prediction.team1.name}</div>
                <div className="text-5xl font-bold text-neon-blue mb-2">
                  {prediction.team1.probability}%
                </div>
                <div className={`px-3 py-1 rounded-full text-sm inline-block ${
                  prediction.team1.confidence === 'High'
                    ? 'bg-green-500/20 text-green-400'
                    : prediction.team1.confidence === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {prediction.team1.confidence} Confidence
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">{getTeamFlag(prediction.team2.name)}</div>
                <div className="font-bold text-xl mb-2">{prediction.team2.name}</div>
                <div className="text-5xl font-bold text-neon-purple mb-2">
                  {prediction.team2.probability}%
                </div>
                <div className={`px-3 py-1 rounded-full text-sm inline-block ${
                  prediction.team2.confidence === 'High'
                    ? 'bg-green-500/20 text-green-400'
                    : prediction.team2.confidence === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {prediction.team2.confidence} Confidence
                </div>
              </div>
            </div>

            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.team1.probability}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-blue to-blue-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.team2.probability}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-neon-purple to-purple-500"
              />
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="font-semibold mb-3 text-neon-blue">Key Factors</h3>
            <ul className="space-y-2">
              {prediction.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-neon-purple">•</span>
                  <span className="text-white/80">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-4 rounded-xl text-center text-sm text-white/60">
            <p>Venue: {prediction.venue} | Format: {prediction.matchType}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
