'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CricketMatch } from '@/types/cricket';
import { getMatchStatus, getTeamFlag, getMatchTypeColor } from '@/lib/cricketUtils';

interface Props {
  matches: CricketMatch[];
}

export default function LiveMatches({ matches }: Props) {
  const router = useRouter();

  if (matches.length === 0) {
    return (
      <div className="glass-strong p-12 rounded-xl text-center">
        <p className="text-xl text-white/60">No live matches at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {matches.map((match, idx) => {
        const status = getMatchStatus(match.status);
        
        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => router.push(`/cricket/match/${match.id}`)}
            className="glass-strong p-6 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} text-white`}>
                  {status.text}
                </span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getMatchTypeColor(match.matchType)}`}>
                  {match.matchType}
                </span>
              </div>
              <div className="text-sm text-white/50">
                {match.venue}
              </div>
            </div>

            <div className="space-y-4">
              {match.teams.slice(0, 2).map((team, teamIdx) => {
                const teamInfo = match.teamInfo?.[teamIdx];
                const score = match.score?.find((s) => 
                  s.inning.toLowerCase().includes(team.toLowerCase())
                );

                return (
                  <div key={team} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTeamFlag(team)}</span>
                      <span className="font-semibold text-white text-lg">
                        {teamInfo?.shortname || team}
                      </span>
                    </div>
                    {score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-neon-blue">
                          {score.r}/{score.w}
                        </div>
                        <div className="text-sm text-white/50">
                          ({score.o} ov)
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/70">{match.status}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
