'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

type VaultItem = {
  _id: string
  type: string
  contentData: {
    title?: string
    description?: string
  }
  createdAt: string
}

type Analytics = {
  totalSaved: number
  byType: Record<string, number>
}

export default function VaultPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [content, setContent] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchVault();
    fetchAnalytics();
  }, [isAuthenticated]);

  const fetchVault = async () => {
    try {
      const response = await api.get('/api/vault');
      setContent(response.data.content);
    } catch (error) {
      toast.error('Failed to load vault');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/vault/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.delete(`/api/vault/${id}`);
      toast.success('Removed from vault');
      fetchVault();
      fetchAnalytics();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-heading font-bold glow-text mb-4 text-center">
        Your Vault
      </h1>

      <p className="text-white/60 text-center">
        Your private space to save moods, memories, and favorite content
      </p>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-8">
          <div className="glass p-6 rounded-xl">
            <div className="text-neon-blue text-3xl font-bold">
              {analytics.totalSaved}
            </div>
            <div className="text-white/60 text-sm">Total Saved</div>
          </div>

          {Object.entries(analytics.byType || {}).map(([type, count]) => (
            <div key={type} className="glass p-6 rounded-xl">
              <div className="text-neon-purple text-3xl font-bold">
                {count}
              </div>
              <div className="text-white/60 text-sm capitalize">
                {type}s
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-medium">
                {item.type}
              </span>

              <button
                onClick={() => deleteItem(item._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-semibold text-white mb-2">
              {item.contentData.title || 'Untitled'}
            </h3>

            {item.contentData.description && (
              <p className="text-sm text-white/60 line-clamp-2 mb-2">
                {item.contentData.description}
              </p>
            )}

            <div className="text-xs text-white/40">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-16">
          <div className="text-white/40 text-lg">
            Your vault is empty. Start saving content!
          </div>
        </div>
      )}
    </div>
  );
}
