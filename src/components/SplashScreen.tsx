import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-green-400"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '-20px',
                }}
                animate={{
                  y: [-20, -500],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="relative text-center">
            <motion.div
              className="mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                duration: 1 
              }}
            >
              <div className="text-6xl font-bold text-white mb-2">🌊</div>
              <h1 className="text-4xl font-bold text-white mb-2">AquaHelix</h1>
              <p className="text-white/80 text-lg">Gestion Aquacole Intelligente</p>
            </motion.div>

            <div className="flex justify-center items-center space-x-12 mt-8">
              <motion.div
                className="text-4xl"
                animate={{ 
                  x: [-50, 50, -50],
                  rotate: [0, 5, 0] 
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🐌
              </motion.div>

              <motion.div
                className="text-4xl"
                animate={{ 
                  x: [50, -50, 50],
                  scaleX: [1, -1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🐟
              </motion.div>
            </div>

            <motion.div 
              className="mt-8 w-64 h-2 bg-white/30 rounded-full overflow-hidden mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full bg-white/70 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
