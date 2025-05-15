import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Pill, Brain, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Diagnose Description',
      description: 'Receive instant and accurate diagnoses for your symptoms using AI-powered technology, designed to bring you the most precise medical insights.',
      icon: Stethoscope,
      route: '/diagnose',
      color: 'text-green-500'
    },
    {
      title: 'Medicine Description',
      description: 'Get detailed information about prescribed medicines, including side effects, dosage, and benefits tailored to your condition.',
      icon: Pill,
      route: '/medicine',
      color: 'text-blue-500'
    },
    {
      title: 'Emotional Healthcare',
      description: 'We care for your emotional well-being. Explore stress management tips, mental health support, and lifestyle guidance for holistic health.',
      icon: Brain,
      route: '/emotions',
      color: 'text-purple-500'
    },
    {
      title: 'AI Chat Assistant',
      description: 'Connect with our AI-powered chat assistant for immediate health-related queries and guidance, available 24/7.',
      icon: MessageSquare,
      route: '/chat',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Simplifying </span>
            <span className="text-gradient">Complexity</span>
            <span className="text-gray-900 dark:text-white"> with Virtual Doctor</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Access our comprehensive suite of healthcare tools designed to provide you with accurate, reliable, and immediate medical assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate(tool.route)}
            >
              <div className={`${tool.color} mb-6`}>
                <tool.icon className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {tool.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${tool.color}`}
                >
                  <tool.icon className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Why Choose Our Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Accuracy
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced algorithms ensure precise diagnoses and recommendations.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                24/7 Availability
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access healthcare assistance anytime, anywhere.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Holistic Approach
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive care for both physical and mental well-being.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tools;