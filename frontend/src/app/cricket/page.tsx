'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CricketPage() {
  const [live, setLive] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [trivia, setTrivia] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cricket/live').then(res => setLive(res.data.data));
    axios.get('http://localhost:5000/api/cricket/rankings').then(res => setRankings(res.data.data));
    axios.get('http://localhost:5000/api/cricket/schedule').then(res => setSchedule(res.data.data));
    axios.get('http://localhost:5000/api/cricket/trivia').then(res => setTrivia(res.data.data));
  }, []);

  const handlePredict = async () => {
    const res = await axios.post('http://localhost:5000/api/cricket/predict', {
      team1: "India",
      team2: "Australia"
    });
    setPrediction(res.data.data);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">

      <h1 className="text-5xl font-bold glow-text mb-8">Cricket Hub</h1>

      {/* LIVE */}
      <section>
        <h2 className="text-2xl mb-4">🔥 Live Matches</h2>
        {live?.slice(0,3).map((match: any, i: number) => (
          <div key={i} className="glass-strong p-4 rounded-xl mb-3">
            {match.name}
          </div>
        ))}
      </section>

      {/* RANKINGS */}
      <section>
        <h2 className="text-2xl mb-4">🏆 Rankings</h2>
        {rankings?.slice(0,5).map((team: any, i: number) => (
          <div key={i} className="glass-strong p-3 rounded-xl mb-2">
            {team.name}
          </div>
        ))}
      </section>

      {/* SCHEDULE */}
      <section>
        <h2 className="text-2xl mb-4">📅 Schedule</h2>
        {schedule?.slice(0,3).map((match: any, i: number) => (
          <div key={i} className="glass-strong p-3 rounded-xl mb-2">
            {match.name}
          </div>
        ))}
      </section>

      {/* TRIVIA */}
      <section>
        <h2 className="text-2xl mb-4">🎯 Trivia</h2>
        <div className="glass-strong p-4 rounded-xl">{trivia}</div>
      </section>

      {/* AI Predictor */}
      <section>
        <h2 className="text-2xl mb-4">🤖 AI Match Predictor</h2>
        <button
          onClick={handlePredict}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
        >
          Predict India vs Australia
        </button>

        {prediction && (
          <div className="glass-strong p-4 mt-4 rounded-xl">
            <p>Winner: {prediction.winner}</p>
            <p>Confidence: {prediction.confidence}%</p>
            <p>{prediction.reason}</p>
          </div>
        )}
      </section>

    </div>
  );
}
