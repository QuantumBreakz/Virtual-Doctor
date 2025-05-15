import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    // TODO: Implement actual login logic
    console.log('Login values:', values);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
            >
              Sign up
            </Link>
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                        errors.email && touched.email
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                        errors.password && touched.password
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter your password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  Sign in
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login; 