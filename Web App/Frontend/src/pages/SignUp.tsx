import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { post } from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState(''); // Added useState for Full Name

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, 'Full Name must be at least 3 characters')
      .required('Full Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await post('/api/users/register/', values, false); // No auth token needed
      console.log('Signup success:', response.data);

      // Check if the response contains a token
      if (response) {
        login(response.data.user.email); // Store token using context
        navigate('/'); // Redirect on success
      } else {
        console.error('No token received from the server.');
        alert('Signup failed: No token received from the server.');
      }
    } catch (error: any) {
      // Handle network errors and server errors
      if (error.response) {
        console.error('Signup error:', error.response.data || error.message);
        alert(`Signup failed: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        console.error('Signup error: No response received from the server.');
        alert('Signup failed: No response received from the server.');
      } else {
        console.error('Signup error:', error.message);
        alert(`Signup failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Virtual Doctor and take control of your health
            </p>
          </div>

          <Formik
            initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setFullName(values.fullName); // Store Full Name in useState
              handleSubmit(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;