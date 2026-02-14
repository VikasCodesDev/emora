'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await api.get('/polls');
      setPolls(res.data.polls);
    } catch (error) {
      toast.error('Failed to load polls');
    }
  };

  const createPoll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login');
      return;
    }
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) {
      toast.error('Question and at least 2 options required');
      return;
    }
    try {
      await api.post('/polls', { question, options: validOptions });
      toast.success('Poll created!');
      setShowCreate(false);
      setQuestion('');
      setOptions(['', '']);
      fetchPolls();
    } catch (error) {
      toast.error('Failed to create poll');
    }
  };

  const vote = async (pollId: string, optionIndex: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }
    try {
      await api.post(`/polls/${pollId}/vote`, { optionIndex });
      toast.success('Vote recorded!');
      fetchPolls();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Vote failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-heading font-bold glow-text">Polls</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Poll
        </button>
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong p-6 rounded-xl mb-8"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Poll question..."
            className="w-full mb-4 px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
          />
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[idx] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${idx + 1}`}
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
            />
          ))}
          <div className="flex gap-3">
            {options.length < 6 && (
              <button
                onClick={() => setOptions([...options, ''])}
                className="px-4 py-2 glass rounded-lg"
              >
                Add Option
              </button>
            )}
            <button
              onClick={createPoll}
              className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg"
            >
              Create
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map((poll: any, idx) => {
          const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
          return (
            <motion.div
              key={poll._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">{poll.question}</h3>
              <div className="space-y-3">
                {poll.options.map((option: any, optIdx: number) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => vote(poll._id, optIdx)}
                      className="w-full text-left p-3 glass rounded-lg hover:bg-white/10 transition-all relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-neon-blue/20"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between items-center">
                        <span>{option.text}</span>
                        <span className="text-sm text-white/60">
                          {option.votes} ({Math.round(percentage)}%)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-white/50">
                Total votes: {totalVotes}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
