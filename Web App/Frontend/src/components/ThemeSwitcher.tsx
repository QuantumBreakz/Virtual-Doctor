import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-500" />
      )}
    </motion.button>
  );
};

export default ThemeSwitcher;