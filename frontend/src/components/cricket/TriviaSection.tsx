'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Trivia } from '@/types/cricket';

interface Props {
  trivia: Trivia | null;
  onNewQuestion: () => void;
}

export default function TriviaSection({ trivia, onNewQuestion }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!trivia) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-heading font-bold mb-6 text-neon-blue">
          Cricket Trivia
        </h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{trivia.question}</h3>
          
          {showAnswer ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-neon-green/20 rounded-lg border border-neon-green/30">
                <p className="font-semibold text-neon-green text-lg">
                  {trivia.answer}
                </p>
              </div>
              
              {trivia.explanation && (
                <div className="p-4 glass rounded-lg">
                  <p className="text-white/80">{trivia.explanation}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="p-8 glass rounded-lg text-center">
              <p className="text-white/50">Click "Show Answer" to reveal</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-5 h-5" />
                Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Show Answer
              </>
            )}
          </button>

          <button
            onClick={() => {
              setShowAnswer(false);
              onNewQuestion();
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Next Question
          </button>
        </div>
      </motion.div>
    </div>
  );
}
