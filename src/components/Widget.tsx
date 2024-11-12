import React from 'react';
import { motion } from 'framer-motion';

interface WidgetProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Widget: React.FC<WidgetProps> = ({ title, icon, onClick, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 cursor-pointer border border-gray-700/50 hover:border-sky-500/50 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-sky-400 text-3xl">{icon}</div>
        <h3 className="text-white font-medium">{title}</h3>
      </div>
    </motion.div>
  );
};