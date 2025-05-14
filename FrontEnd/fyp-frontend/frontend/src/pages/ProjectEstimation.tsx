import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { get, post, del } from '../utils/axios';

interface ResponseItem {
  question: string;
  answer: string;
  type: 'user' | 'bot';
  text: string;
}

const ProjectEstimation = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [tempResponses, setTempResponses] = useState<ResponseItem[]>([]);
  const [error, setError] = useState('');
  const [showEstimation, setShowEstimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimationLoading, setEstimationLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ecommerceEstimate, setEcommerceEstimate] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(storedTheme === 'dark' || (!storedTheme && prefersDark));
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    const userMessage: ResponseItem = {
      question: message,
      answer: '',
      type: 'user',
      text: message
    };

    setTempResponses(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await post('/api/project-estimate', { query: message });
      
      const botMessage: ResponseItem = {
        question: message,
        answer: response.data.response,
        type: 'bot',
        text: response.data.response
      };

      setTempResponses(prev => [...prev, botMessage]);
      setEcommerceEstimate(response.data.estimation);
      setShowEstimation(true);
    } catch (err) {
      setError('Failed to get response');
      console.error(err);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const exportPDF = async () => {
    const content = document.getElementById('summary-content');
    if (!content) return;

    try {
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.setFontSize(18);
      pdf.text('Project Estimations', 12, 25);
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth, pdfHeight);
      pdf.save('project_estimations.pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Project Estimation
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="h-[500px] overflow-y-auto mb-4">
                {[...responses, ...tempResponses].map((response, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      response.type === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                        response.type === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      {response.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-center">
                    <div className="animate-pulse text-gray-500 dark:text-gray-400">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>

            {showEstimation && ecommerceEstimate && (
              <div id="summary-content" className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Project Summary
                </h2>
                <div className="space-y-4">
                  {Object.entries(ecommerceEstimate).map(([key, value]) => (
                    <div key={key} className="border-b dark:border-gray-600 pb-2">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h3>
                      <p className="text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Export Options
            </h2>
            <div className="space-y-4">
              <button
                onClick={exportPDF}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Export as PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEstimation;