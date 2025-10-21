import React, { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, BarChart3, Search, Menu, X, Home, User, Users, FileText, Calendar, Shield, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </motion.button>

          {/* Logo Animated */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-20 blur-sm"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AquaManager Pro
            </motion.h1>
          </motion.div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </motion.a>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block"
              >
                <Input
                  placeholder="Rechercher..."
                  className="rounded-full border-gray-300 focus:border-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
          {/* User menu replaced by dedicated UserMenu component */}
          <div onClick={() => setUserMenuOpen(true)}>
            <UserMenu />
          </div>
        </div>
      </motion.header>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 border-r"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="font-bold text-gray-900">Navigation</span>
                </div>
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Pages List */}
              <div className="p-4 space-y-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Pages Disponibles
                </h3>
                {pageItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500 group-hover:text-blue-500">
                          {item.description}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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