import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, LineChart as ChartLine, Calendar, Clock } from 'lucide-react';

const Emotions = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const emotions = ['Happy', 'Sad', 'Anxious', 'Excited', 'Tired', 'Calm'];

  const emotionColors = {
    Happy: 'bg-yellow-500',
    Sad: 'bg-blue-500',
    Anxious: 'bg-purple-500',
    Excited: 'bg-red-500',
    Tired: 'bg-gray-500',
    Calm: 'bg-green-500',
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emotional Health</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">How are you feeling today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`p-4 rounded-lg text-white transition-transform transform hover:scale-105 ${
                    emotionColors[emotion as keyof typeof emotionColors]
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            {selectedEmotion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="text-gray-700 dark:text-gray-300">
                  You're feeling {selectedEmotion.toLowerCase()}. Would you like to talk about it?
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mood Tracking</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <ChartLine className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Weekly Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your mood has been improving</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Monthly Patterns</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View your emotional trends</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Daily Check-ins</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your mood throughout the day</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Emotions;