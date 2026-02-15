'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CricketMatch } from '@/types/cricket';
import { formatDate, getCountdownTime, getTeamFlag, getMatchTypeColor } from '@/lib/cricketUtils';

interface Props {
  matches: CricketMatch[];
}

export default function Schedule({ matches }: Props) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredMatches = filterType === 'all' 
    ? matches 
    : matches.filter(m => m.matchType.toLowerCase() === filterType.toLowerCase());

  const groupedByDate = filteredMatches.reduce((acc, match) => {
    const date = formatDate(match.dateTimeGMT);
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, CricketMatch[]>);

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {['all', 'test', 'odi', 't20'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filterType === type
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple'
                : 'glass hover:bg-white/10'
            }`}
          >
            {type === 'all' ? 'All Matches' : type.toUpperCase()}
          </button>
        ))}
      </div>

      {Object.keys(groupedByDate).length === 0 ? (
        <div className="glass-strong p-12 rounded-xl text-center">
          <p className="text-xl text-white/60">No upcoming matches</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, matchesOnDate]) => (
            <div key={date}>
              <h3 className="text-xl font-heading font-bold mb-4 text-neon-blue">
                {date}
              </h3>
              <div className="space-y-4">
                {matchesOnDate.map((match, idx) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass p-6 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchTypeColor(match.matchType)}`}>
                          {match.matchType}
                        </span>
                        <span className="text-sm text-white/50">{match.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neon-purple">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {getCountdownTime(match.dateTimeGMT)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        {match.teams.slice(0, 2).map((team) => {
                          const teamInfo = match.teamInfo?.find(
                            (t) => t.name === team || t.shortname === team
                          );
                          return (
                            <div key={team} className="flex items-center space-x-3">
                              <span className="text-xl">{getTeamFlag(team)}</span>
                              <span className="font-semibold">
                                {teamInfo?.shortname || team}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-right text-sm text-white/60">
                        {new Date(match.dateTimeGMT).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
