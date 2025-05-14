import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Medicine from './pages/Medicine';
import Diagnose from './pages/Diagnose';
import AIChat from './pages/AIChat';
import Emotions from './pages/Emotions';
import Tools from './pages/Tools';
import Dashboard from './pages/Dashboard';
import MedicineDescription from './pages/MedicineDescription';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = isDarkMode ? 'light' : 'dark';
  };

  return (
    <Router>
      <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={
            <main className="relative">
              <Hero isDarkMode={isDarkMode} />
              <Testimonials />
            </main>
          } />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/medicine-description" element={<MedicineDescription />} />
          <Route path="/diagnose" element={<Diagnose />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/emotions" element={<Emotions />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </Router>
  );
}

export default App;