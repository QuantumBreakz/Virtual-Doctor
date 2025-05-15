import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

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
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-green-500 to-blue-500">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-white">
                  {user.fullName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-white/80">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.fullName}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.email}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.phone || 'Not provided'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Profile Actions */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
            <button
              type="button"
              onClick={() => {/* TODO: Implement edit profile */}}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 