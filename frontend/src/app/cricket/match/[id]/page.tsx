'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Scorecard } from '@/types/cricket';
import { getTeamFlag, getMatchStatus } from '@/lib/cricketUtils';

export default function MatchScorecardPage() {
  const params = useParams();
  const router = useRouter();
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchScorecard(params.id as string);
    }
  }, [params.id]);

  const fetchScorecard = async (id: string) => {
    try {
      const res = await api.get(`/cricket/scorecard/${id}`);
      setScorecard(res.data.data);
    } catch (error) {
      toast.error('Failed to load scorecard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!scorecard) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="glass-strong p-12 rounded-xl text-center">
          <p className="text-xl text-white/60">Scorecard not available</p>
        </div>
      </div>
    );
  }

  const { info, scorecard: scorecardData } = scorecard;
  const status = getMatchStatus(info.status);

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cricket Hub
      </button>

      <div className="glass-strong p-8 rounded-2xl mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{info.name}</h1>
            <p className="text-white/60">{info.venue}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color} text-white`}>
              {status.text}
            </span>
            <p className="text-sm text-white/50 mt-2">{info.matchType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {info.teams.slice(0, 2).map((team, idx) => {
            const teamInfo = info.teamInfo?.[idx];
            const score = info.score?.find((s) => 
              s.inning.toLowerCase().includes(team.toLowerCase())
            );

            return (
              <div key={team} className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getTeamFlag(team)}</span>
                  <span className="font-bold text-xl">{teamInfo?.shortname || team}</span>
                </div>
                {score && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-neon-blue">
                      {score.r}/{score.w}
                    </div>
                    <div className="text-sm text-white/50">({score.o} ov)</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {info.tossWinner && (
          <div className="mt-4 p-3 glass rounded-lg text-center text-sm">
            <span className="text-white/70">Toss: </span>
            <span className="font-semibold">{info.tossWinner}</span>
            {info.tossChoice && (
              <span className="text-white/70"> chose to {info.tossChoice}</span>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-center text-white/80">{info.status}</p>
        </div>
      </div>

      {scorecardData?.innings && scorecardData.innings.length > 0 ? (
        <div className="space-y-6">
          {scorecardData.innings.map((inning, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-strong rounded-xl overflow-hidden"
            >
              <div className="p-6 bg-white/5 border-b border-white/10">
                <h2 className="text-xl font-heading font-bold">{inning.inning}</h2>
                {inning.totals && (
                  <p className="text-neon-blue text-lg font-semibold mt-2">
                    {inning.totals.runs}/{inning.totals.wickets} ({inning.totals.overs} ov)
                  </p>
                )}
              </div>

              {inning.batting && inning.batting.length > 0 && (
                <div className="p-6">
                  <h3 className="font-semibold mb-4 text-neon-purple">Batting</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2">Batsman</th>
                          <th className="text-center py-2">R</th>
                          <th className="text-center py-2">B</th>
                          <th className="text-center py-2">4s</th>
                          <th className="text-center py-2">6s</th>
                          <th className="text-center py-2">SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inning.batting.map((bat, bidx) => (
                          <tr key={bidx} className="border-b border-white/5">
                            <td className="py-3">
                              <div className="font-medium">{bat.batsman}</div>
                              <div className="text-xs text-white/50">{bat.dismissal}</div>
                            </td>
                            <td className="text-center font-semibold">{bat.runs}</td>
                            <td className="text-center text-white/70">{bat.balls}</td>
                            <td className="text-center text-white/70">{bat.fours}</td>
                            <td className="text-center text-white/70">{bat.sixes}</td>
                            <td className="text-center text-neon-blue">{bat.strikeRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {inning.extras && (
                    <div className="mt-4 p-3 glass rounded-lg text-sm">
                      <span className="text-white/70">Extras: </span>
                      <span className="font-semibold">{inning.extras.total}</span>
                      <span className="text-white/50 ml-2">
                        (b {inning.extras.byes}, lb {inning.extras.legByes}, w {inning.extras.wides}, nb {inning.extras.noBalls})
                      </span>
                    </div>
                  )}
                </div>
              )}

              {inning.bowling && inning.bowling.length > 0 && (
                <div className="p-6 border-t border-white/10">
                  <h3 className="font-semibold mb-4 text-neon-purple">Bowling</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2">Bowler</th>
                          <th className="text-center py-2">O</th>
                          <th className="text-center py-2">M</th>
                          <th className="text-center py-2">R</th>
                          <th className="text-center py-2">W</th>
                          <th className="text-center py-2">Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inning.bowling.map((bowl, boidx) => (
                          <tr key={boidx} className="border-b border-white/5">
                            <td className="py-3 font-medium">{bowl.bowler}</td>
                            <td className="text-center text-white/70">{bowl.overs}</td>
                            <td className="text-center text-white/70">{bowl.maidens}</td>
                            <td className="text-center text-white/70">{bowl.runs}</td>
                            <td className="text-center font-semibold text-neon-green">{bowl.wickets}</td>
                            <td className="text-center text-neon-blue">{bowl.economy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-strong p-12 rounded-xl text-center">
          <p className="text-white/60">Detailed scorecard not available yet</p>
        </div>
      )}
    </div>
  );
}
