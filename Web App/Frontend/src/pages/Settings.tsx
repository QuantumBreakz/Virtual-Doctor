import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bell, Lock, Moon, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Notifications Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your notification preferences
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Configure
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Privacy
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your privacy settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Configure
              </button>
            </div>

            {/* Appearance Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Appearance
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customize your interface
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Configure
              </button>
            </div>

            {/* Language Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Language
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred language
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Configure
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 