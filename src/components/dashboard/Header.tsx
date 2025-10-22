import React, { useState, useEffect, useRef } from 'react';
import { UserMenu } from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Settings, BarChart3, Search, Menu, Home, User, Users, FileText, Calendar, Shield, HelpCircle, Linkedin, Facebook, Twitter, Book } from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const Header: React.FC = () => {

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pages disponibles dans le dossier pages
  const pageItems = [
    { href: '/', label: 'Accueil', icon: Home, description: 'Page principale' },
    { href: '/onboarding', label: 'Onboarding', icon: User, description: 'Configuration initiale' },
    { href: '/admin', label: 'Administration', icon: Shield, description: 'Gestion administrateur' },
  ];

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '#reports', label: 'Rapports', icon: FileText },
    { href: '#calendar', label: 'Calendrier', icon: Calendar },
    { href: '#settings', label: 'Paramètres', icon: Settings }
  ];

  

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md border-b shadow-lg' 
            : 'bg-white border-b'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo et Navigation */}
        <div className="flex items-center gap-6">
          {/* Menu Sidebar Button */}
          <motion.button
            onClick={() => toggleSidebar()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </motion.button>
          {/* Shortcut help icon (left) */}
          <motion.button
            aria-label="Aide"
            title="Aide"
            onClick={() => navigate('/help')}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-white shadow-sm cursor-pointer relative"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center justify-center">
              {/* Main book icon */}
              <Book className="w-5 h-5 text-white" />
              {/* Small help badge */}
              <span className="absolute -right-0.5 -bottom-0.5 bg-white rounded-full p-[2px]">
                <HelpCircle className="w-3 h-3 text-purple-600" />
              </span>
            </div>
          </motion.button>
          {/* Logo Animated */}
          <motion.div className="flex items-center gap-4">
            {/* Sidebar is handled by SidebarProvider and AppSidebar (Sheet for mobile) */}
            {/* Left user menu removed to avoid duplication; keep user menu on the right */}
            {/* Mobile: show animated logo + title next to burger */}
            <div className="flex items-center gap-2 md:hidden">
              <AnimatedLogo size={36} useImage={false} className="shrink-0" mainColor="text-blue-400" secondaryColor="text-blue-600" />
              <span className="font-semibold text-lg glossy-title">AquaHelix</span>
            </div>
          </motion.div>
        </div>

        {/* Right actions: search, notifications, socials, user */}
        <div className="flex items-center gap-3">
          <motion.button
            aria-label="Rechercher"
            className="p-2 rounded-md hover:bg-gray-100"
            whileHover={{ scale: 1.08 }}
            onClick={() => setSearchOpen((s) => !s)}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </motion.button>

          <motion.button
            aria-label="Notifications"
            className="p-2 rounded-md hover:bg-gray-100"
            whileHover={{ scale: 1.06 }}
            onClick={() => { /* integrate notification menu */ }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </motion.button>

          {/* Social icons (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            <motion.a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" whileHover={{ y: -2 }} className="p-1 rounded-full hover:bg-gray-100">
              <Linkedin className="w-5 h-5 text-gray-600" />
            </motion.a>
            <motion.a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" whileHover={{ y: -2 }} className="p-1 rounded-full hover:bg-gray-100">
              <Facebook className="w-5 h-5 text-gray-600" />
            </motion.a>
            <motion.a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" whileHover={{ y: -2 }} className="p-1 rounded-full hover:bg-gray-100">
              <Twitter className="w-5 h-5 text-gray-600" />
            </motion.a>
          </div>

          <div onClick={() => setUserMenuOpen(true)}>
            <UserMenu />
          </div>
        </div>
      </motion.header>

      {/* Sidebar is implemented by AppSidebar (uses Sheet for mobile) */}

      {/* Lightweight focus trap for drawer */}
      {/* focus trap handled by focus-trap-react wrapper above */}

      {/* Close user menu when clicking outside */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;