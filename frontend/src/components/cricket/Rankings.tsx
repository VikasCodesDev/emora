'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Ranking } from '@/types/cricket';
import { getTeamFlag } from '@/lib/cricketUtils';

interface Props {
  rankings: Ranking[];
  format: 'test' | 'odi' | 't20';
  onFormatChange: (format: 'test' | 'odi' | 't20') => void;
}

export default function Rankings({ rankings, format, onFormatChange }: Props) {
  return (
    <div>
      <div className="flex gap-3 mb-6">
        {(['test', 'odi', 't20'] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => onFormatChange(fmt)}
            className={`px-6 py-3 rounded-lg font-medium uppercase ${
              format === fmt
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple'
                : 'glass hover:bg-white/10'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      <div className="glass-strong rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            ICC {format.toUpperCase()} Rankings
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {rankings.map((ranking, idx) => (
            <motion.div
              key={ranking.team}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    ranking.position === 1
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : ranking.position === 2
                      ? 'bg-gray-400/20 text-gray-300'
                      : ranking.position === 3
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-white/5 text-white/50'
                  }`}>
                    {ranking.position}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTeamFlag(ranking.team)}</span>
                    <span className="font-semibold text-lg">{ranking.team}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm text-white/50">Rating</div>
                    <div className="text-2xl font-bold text-neon-blue">
                      {ranking.rating}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-white/50">Points</div>
                    <div className="text-lg font-semibold text-neon-purple">
                      {ranking.points}
                    </div>
                  </div>
                  
                  <div className="text-right hidden md:block">
                    <div className="text-sm text-white/50">Matches</div>
                    <div className="text-lg font-semibold">
                      {ranking.matches}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
