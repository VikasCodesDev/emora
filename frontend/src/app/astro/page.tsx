'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stars } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const zodiacSigns = [
  { name: 'Aries', emoji: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', emoji: '♉', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', emoji: '♊', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', emoji: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', emoji: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', emoji: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', emoji: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', emoji: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', emoji: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', emoji: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', emoji: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', emoji: '♓', dates: 'Feb 19 - Mar 20' },
];

export default function AstroPage() {
  const [selectedSign, setSelectedSign] = useState('');
  const [horoscope, setHoroscope] = useState<any>(null);
  const [compatibility, setCompatibility] = useState<any>(null);
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');

  const fetchHoroscope = async (sign: string) => {
    try {
      const res = await api.get(`/astro/horoscope/${sign.toLowerCase()}`);
      setHoroscope(res.data.horoscope);
      setSelectedSign(sign);
    } catch (error) {
      toast.error('Failed to fetch horoscope');
    }
  };

  const checkCompatibility = async () => {
    if (!sign1 || !sign2) {
      toast.error('Select both signs');
      return;
    }
    try {
      const res = await api.get(`/astro/compatibility?sign1=${sign1}&sign2=${sign2}`);
      setCompatibility(res.data.compatibility);
    } catch (error) {
      toast.error('Failed to check compatibility');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">Astrology</h1>
      <p className="text-white/60 text-center"><p className="text-white/60 text-center">Cosmic guidance for modern souls</p>
</p>


      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 mb-12">
        {zodiacSigns.map((sign) => (
          <motion.button
            key={sign.name}
            whileHover={{ scale: 1.05 }}
            onClick={() => fetchHoroscope(sign.name)}
            className={`p-4 glass rounded-xl text-center transition-all ${
              selectedSign === sign.name ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border-2 border-neon-blue' : ''
            }`}
          >
            <div className="text-4xl mb-2">{sign.emoji}</div>
            <div className="font-semibold">{sign.name}</div>
            <div className="text-xs text-white/50">{sign.dates}</div>
          </motion.button>
        ))}
      </div>

      {horoscope && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong p-8 rounded-2xl mb-8 max-w-3xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold mb-2 capitalize">{horoscope.sign}</h2>
            <p className="text-white/60">{horoscope.date}</p>
          </div>
          <p className="text-xl leading-relaxed mb-6 text-center">{horoscope.prediction}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-neon-blue font-bold text-2xl">{horoscope.luckyNumber}</div>
              <div className="text-sm text-white/60">Lucky Number</div>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <div className="text-neon-purple font-bold text-2xl">{horoscope.luckyColor}</div>
              <div className="text-sm text-white/60">Lucky Color</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="glass-strong p-8 rounded-2xl max-w-3xl mx-auto">
        <h3 className="text-2xl font-heading font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Stars className="w-6 h-6 text-neon-pink" />
          Compatibility Check
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
            value={sign1}
            onChange={(e) => setSign1(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
          >
            <option value="">Select Sign 1</option>
            {zodiacSigns.map((sign) => (
              <option key={sign.name} value={sign.name.toLowerCase()}>
                {sign.emoji} {sign.name}
              </option>
            ))}
          </select>
          <select
            value={sign2}
            onChange={(e) => setSign2(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
          >
            <option value="">Select Sign 2</option>
            {zodiacSigns.map((sign) => (
              <option key={sign.name} value={sign.name.toLowerCase()}>
                {sign.emoji} {sign.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={checkCompatibility}
          className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg font-heading font-semibold"
        >
          Check Compatibility
        </button>

        {compatibility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-6 glass rounded-xl text-center"
          >
            <div className="text-5xl font-bold text-neon-pink mb-4">
              {compatibility.score}%
            </div>
            <p className="text-white/80">{compatibility.analysis}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
