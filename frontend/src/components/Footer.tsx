'use client';

import React from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { Mail, ArrowRight, Sparkles, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Memes', href: '/memes' },
      { name: 'Mood', href: '/mood' },
      { name: 'Vault', href: '/vault' },
      { name: 'Music', href: '/music' },
    ],
    community: [
      { name: 'Trending', href: '/trending' },
      { name: 'Cricket', href: '/cricket' },
      { name: 'Polls', href: '/polls' },
      { name: 'Challenges', href: '/challenge' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Help Center', href: '/help' },
    ]
  };

  const socialLinks = [
    { icon: <FaInstagram size={20} />, href: "https://www.instagram.com/vikas01/?hl=en#", color: "hover:text-pink-500", label: "Instagram" },
    { icon: <FaXTwitter size={20} />, href: "https://x.com/MishraVika46260", color: "hover:text-blue-400", label: "X" },
    { icon: <FaLinkedin size={20} />, href: "https://www.linkedin.com/in/vikas-mishra0106", color: "hover:text-blue-600", label: "LinkedIn" },
    { icon: <FaGithub size={20} />, href: "https://github.com/VikasCodesDev", color: "hover:text-gray-400", label: "GitHub" },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 glass pt-16 pb-8 mt-20">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent shadow-[0_0_20px_rgba(0,240,255,0.3)]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple group-hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold gradient-text">Emora</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Next-generation immersive social and entertainment platform. Experience the universe of AI-powered creativity.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className={`text-white/50 transition-colors duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center">
              <span className="w-8 h-px bg-neon-blue mr-3" /> Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-neon-blue transition-colors duration-200 text-sm flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center">
              <span className="w-8 h-px bg-neon-purple mr-3" /> Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-neon-purple transition-colors duration-200 text-sm flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center">
              <span className="w-8 h-px bg-neon-pink mr-3" /> Stay Connected
            </h4>
            <p className="text-white/60 text-sm">Join our newsletter to receive the latest updates and perks.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pl-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-neon-blue transition-colors" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded-lg transition-all duration-300">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-xs">
            © {currentYear} <span className="text-white font-medium">Emora</span>. Designed with 
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block mx-1 text-neon-pink"
            >
              ❤
            </motion.span> 
            by <a href="https://www.linkedin.com/in/vikas-mishra0106" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-neon-blue transition-colors">Vikas</a>
          </div>
          
          <div className="flex gap-8">
            {footerLinks.legal.slice(0, 3).map((link) => (
              <Link key={link.name} href={link.href} className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
