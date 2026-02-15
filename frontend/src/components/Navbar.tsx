'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Memes', path: '/memes' },
  { name: 'Mood', path: '/mood' },
  { name: 'Vault', path: '/vault' },
  { name: 'Music', path: '/music' },
  { name: 'Trending', path: '/trending' },
  { name: 'Cricket', path: '/cricket' },
  { name: 'Wallpapers', path: '/wallpapers' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Polls', path: '/polls' },
  { name: 'Challenge', path: '/challenge' },
  { name: 'Astro', path: '/astro' },
  { name: 'Fashion', path: '/fashion' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold gradient-text">
              Emora
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-3 py-2 text-sm font-medium transition-colors"
                >
                  <span
                    className={cn(
                      'relative z-10',
                      isActive ? 'text-neon-blue' : 'text-white/70 hover:text-white'
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-neon-blue/10 rounded-lg border border-neon-blue/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 glass-strong px-4 py-2 rounded-lg">
                  <User className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm text-white/90">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden overflow-x-auto border-t border-white/10">
        <div className="flex space-x-2 px-4 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-white/70 hover:bg-white/5'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
