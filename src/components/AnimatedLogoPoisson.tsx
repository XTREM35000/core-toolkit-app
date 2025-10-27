import React from 'react';
import { motion } from 'framer-motion';
import { Fish, Shell } from 'lucide-react';

interface AnimatedLogoPoissonProps {
  size?: number; // px
  animated?: boolean;
  showText?: boolean;
  mainColor?: string;
  secondaryColor?: string;
  className?: string;
}

const AnimatedLogoPoisson: React.FC<AnimatedLogoPoissonProps> = ({
  size = 40,
  animated = true,
  showText = false,
  mainColor = 'text-blue-400',
  secondaryColor = 'text-blue-600',
  className = ''
}) => {
  const mainIconSize = Math.round(size * 0.7);
  const secondaryIconSize = Math.round(size * 0.38);

  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ height: size }}>
      <motion.div
        className="relative"
        animate={animated ? { y: [0, -6, 0] } : undefined}
        transition={animated ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <Fish className={`${mainColor} drop-shadow-md`} style={{ width: mainIconSize, height: mainIconSize }} />
        <Shell className={`${secondaryColor} absolute top-0 right-0`} style={{ width: secondaryIconSize, height: secondaryIconSize }} />
      </motion.div>

      {showText && (
        <span className="font-semibold text-sm text-gray-900">MultiFarm SaaS</span>
      )}
    </div>
  );
};

export default AnimatedLogoPoisson;
