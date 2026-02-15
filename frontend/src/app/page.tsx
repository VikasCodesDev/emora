'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Sparkles,
    title: 'AI Mood Detection',
    description: 'Analyze your emotions from text and images with advanced AI',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: Zap,
    title: 'Instant Memes',
    description: 'Fresh memes with AI-generated captions that hit different',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Heart,
    title: 'Personal Vault',
    description: 'Save and organize your favorite content in one place',
    gradient: 'from-pink-500 to-red-600',
  },
  {
    icon: TrendingUp,
    title: 'Always Trending',
    description: "Stay updated with what's hot in entertainment and sports",
    gradient: 'from-cyan-500 to-blue-600',
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-heading font-black mb-6">
              <span className="gradient-text">Emora</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4 font-medium">
              Your AI-Powered Social Universe
            </p>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-12">
              Experience the next generation of social entertainment with mood detection,
              AI-generated content
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/mood"
                className="group relative px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-heading font-semibold text-white overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10">Detect My Mood</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link
                href="/memes"
                className="px-8 py-4 glass-strong rounded-lg font-heading font-semibold text-white hover:bg-white/10 transition-all border border-white/20"
              >
                Explore Memes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 glow-text"
          >
            Powered by Innovation
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass p-6 rounded-xl hover:bg-white/10 transition-all cursor-pointer hover-lift"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong p-12 rounded-2xl border border-neon-blue/30"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 glow-text-pink">
              Ready to Experience the Future?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Join thousands exploring a new way to connect, create, and discover
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue rounded-lg font-heading font-bold text-white text-lg hover:shadow-2xl hover:shadow-neon-pink/50 transition-all animate-glow-pulse"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
