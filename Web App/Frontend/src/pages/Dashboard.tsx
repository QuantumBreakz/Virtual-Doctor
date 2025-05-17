import React from 'react';
import { motion } from 'framer-motion';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const healthData = [
    { date: 'Mon', heartRate: 72, bloodPressure: 120, steps: 8000 },
    { date: 'Tue', heartRate: 75, bloodPressure: 118, steps: 10000 },
    { date: 'Wed', heartRate: 71, bloodPressure: 122, steps: 7500 },
    { date: 'Thu', heartRate: 73, bloodPressure: 119, steps: 9000 },
    { date: 'Fri', heartRate: 74, bloodPressure: 121, steps: 8500 },
    { date: 'Sat', heartRate: 70, bloodPressure: 117, steps: 11000 },
    { date: 'Sun', heartRate: 76, bloodPressure: 120, steps: 9500 },
  ];

  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-03-15',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: '2024-03-18',
      time: '2:30 PM',
      status: 'upcoming'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Wilson',
      specialty: 'Dermatologist',
      date: '2024-03-12',
      time: '11:15 AM',
      status: 'completed'
    }
  ];

  const stats = [
    {
      title: 'Heart Rate',
      value: '72 bpm',
      change: '+2%',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Blood Pressure',
      value: '120/80',
      change: '-1%',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Steps Today',
      value: '8,547',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Appointments',
      value: '3',
      change: 'This Week',
      icon: Calendar,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your health metrics and upcoming appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.includes('+') ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Heart Rate Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Daily Activity
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Appointments
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 text-gray-600 dark:text-gray-400">Doctor</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400">Specialty</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400">Date</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400">Time</th>
                  <th className="pb-3 text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b dark:border-gray-700">
                    <td className="py-4 text-gray-900 dark:text-white">
                      {appointment.doctor}
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {appointment.specialty}
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {appointment.date}
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {appointment.time}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'upcoming'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;