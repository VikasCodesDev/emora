'use client';
import { motion } from 'framer-motion';

export default function FashionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-heading font-bold glow-text mb-8 capitalize">fashion</h1>
        <div className="glass-strong p-12 rounded-2xl border border-neon-blue/30 text-center">
          <p className="text-xl text-white/70">
            Fashion feature coming soon! This page will include amazing AI-powered content.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
