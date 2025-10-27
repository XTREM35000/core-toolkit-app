import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const activities = [
    { icon: "🐟", name: "Pisciculture", delay: 0 },
    { icon: "🐌", name: "Héliciculture", delay: 0.2 },
    { icon: "🐔", name: "Aviculture", delay: 0.4 },
    { icon: "🐰", name: "Cuniculture", delay: 0.6 },
    { icon: "🐝", name: "Apiculture", delay: 0.8 },
    { icon: "🐄", name: "Bovins", delay: 1.0 },
    { icon: "🌱", name: "Agriculture", delay: 1.2 },
    { icon: "🎣", name: "Pêche", delay: 1.4 }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-green-500"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bulles d'eau animées */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '-20px',
                }}
                animate={{
                  y: [-20, -600],
                  opacity: [0, 0.8, 0],
                  scale: [0.3, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          <div className="relative text-center max-w-4xl mx-auto px-6">
            {/* Logo et titre principal */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                duration: 1 
              }}
            >
              <motion.div 
                className="text-7xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌊
              </motion.div>
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                MultiFarm SaaS
              </h1>
              <motion.p 
                className="text-white/80 text-xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Suite de Gestion Agricole Complète
              </motion.p>
            </motion.div>

            {/* Signature et photo - NOUVELLE ORGANISATION */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {/* Texte de signature */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.p 
                  className="text-white/90 text-lg font-light mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Développé par
                </motion.p>
                <motion.h2 
                  className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  Thierry Gogo
                </motion.h2>
                <motion.p 
                  className="text-white/70 text-md font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  Freelance Full-Stack Developer
                </motion.p>
              </motion.div>

              {/* Photo de profil - MAINTENANT EN DESSOUS */}
              <motion.div
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  damping: 20,
                  delay: 2.0
                }}
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden bg-gray-200 mx-auto"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <img 
                      src="/images/profile01.png" 
                      alt="Thierry Gogo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-yellow-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Grille des activités animées */}
            <motion.div 
              className="grid grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.name}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 2.7 + activity.delay,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, 0] 
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    {activity.icon}
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">
                    {activity.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Barre de progression */}
            <motion.div 
              className="mt-8 w-80 h-3 bg-white/20 rounded-full overflow-hidden mx-auto shadow-inner"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full shadow-lg"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Message de chargement */}
            <motion.p
              className="text-white/60 text-sm mt-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              Chargement de votre espace de travail...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;