import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

interface InitialValues {
  businessSize: string;
  businessType: string;
  projectType: string;
  noOfUsers: string;
  budget: string;
  expectations: string;
  infrastructure: string;
}

const Solution = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValues>({
    businessSize: '',
    businessType: '',
    projectType: '',
    noOfUsers: '',
    budget: '',
    expectations: '',
    infrastructure: ''
  });

  const validationSchema = Yup.object({
    businessSize: Yup.string()
      .trim('No leading or trailing spaces')
      .strict(true)
      .matches(/^\S.*\S$|^\S$/, 'No leading or trailing spaces allowed')
      .required('Business size is required'),
    businessType: Yup.string()
      .required('Business type is required'),
    projectType: Yup.string()
      .required('Project type is required'),
    noOfUsers: Yup.string()
      .trim('No leading or trailing spaces')
      .strict(true)
      .matches(/^\S.*\S$|^\S$/, 'No leading or trailing spaces allowed')
      .required('Number of users is required'),
    budget: Yup.string()
      .trim('No leading or trailing spaces')
      .strict(true)
      .matches(/^\S.*\S$|^\S$/, 'No leading or trailing spaces allowed')
      .required('Budget is required'),
    expectations: Yup.string()
      .trim('No leading or trailing spaces')
      .strict(true)
      .matches(/^\S.*\S$|^\S$/, 'No leading or trailing spaces allowed')
      .required('Expectations are required'),
    infrastructure: Yup.string()
      .trim('No leading or trailing spaces')
      .strict(true)
      .matches(/^\S.*\S$|^\S$/, 'No leading or trailing spaces allowed')
      .required('Infrastructure status is required'),
  });

  const handleSubmit = async (values: InitialValues) => {
    setLoader(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/solution-page2');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 w-full max-w-7xl p-6"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="font-normal">Find </span>
            <span className="text-gradient">Tech Stack</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecting the ideal tech stack involves understanding needs, assessing scalability
            and performance, and considering developer experience
          </p>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessSize" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Business Size <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="businessSize"
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter business size..."
                  />
                  <ErrorMessage name="businessSize" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <label htmlFor="businessType" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="businessType"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Business type...</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="data">Data</option>
                    <option value="ai">AI</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="businessType" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <label htmlFor="projectType" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="projectType"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select project type...</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="data">Data Analysis</option>
                    <option value="ai">AI/ML</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="projectType" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="noOfUsers" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Number of Users <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="noOfUsers"
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter expected number of users..."
                  />
                  <ErrorMessage name="noOfUsers" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="budget"
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget/fundings..."
                  />
                  <ErrorMessage name="budget" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="expectations" className="block text-gray-700 dark:text-gray-200 mb-2">
                    Expectations <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="expectations"
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter expectations from the project..."
                  />
                  <ErrorMessage name="expectations" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <label htmlFor="infrastructure" className="block text-gray-700 dark:text-gray-200 mb-2">
                  Infrastructure <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="infrastructure"
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Current infrastructure and status..."
                />
                <ErrorMessage name="infrastructure" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loader}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50"
                >
                  {loader ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.main>
    </div>
  );
};

export default Solution;