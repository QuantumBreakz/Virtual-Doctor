import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Activity, Brain, Laptop, Users, ChevronRight, ArrowRight, Heart, Shield,
  Stethoscope, Clock, Award, TrendingUp, CheckCircle, Star, Phone, Video
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import projectInfo from '../data/projectInfo.json';

interface HeroProps {
  isDarkMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const [ref, inView] = useInView({ threshold: 0.3 });

  // Features section data
  const features = [
    {
      icon: Stethoscope,
      title: "Smart Diagnostics",
      description: "AI-powered symptom analysis with 95% accuracy"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock access to medical professionals"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "HIPAA-compliant platform with end-to-end encryption"
    },
    {
      icon: Award,
      title: "Expert Care",
      description: "Access to board-certified healthcare providers"
    },
    {
      icon: TrendingUp,
      title: "Health Tracking",
      description: "Real-time monitoring of vital health metrics"
    },
    {
      icon: Heart,
      title: "Preventive Care",
      description: "Personalized wellness recommendations"
    }
  ];

  // Services section data
  const services = [
    {
      title: "Video Consultations",
      description: "Face-to-face virtual appointments with healthcare providers",
      icon: Video,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock medical assistance and emergency support",
      icon: Phone,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2070"
    },
    {
      title: "Health Monitoring",
      description: "Continuous tracking of vital signs and health metrics",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2070"
    }
  ];

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070"
            alt="Medical Background"
            className="object-cover w-full h-full"
          />
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-emerald-900/80' 
              : 'bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/80'
          }`} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
              {/* Left Column - Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="lg:pr-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6"
                >
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Revolutionizing Healthcare
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Your Health,{' '}
                  <span className="relative">
                    Reimagined
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 5.8C67.6667 2.6 203.8 -1.8 356 5.8" stroke={isDarkMode ? "#34D399" : "#059669"} strokeWidth="3"/>
                    </svg>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`text-xl leading-relaxed mb-8 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Experience healthcare that transcends boundaries. Our AI-powered platform 
                  delivers precision diagnostics, personalized care, and real-time health 
                  monitoring—all at your fingertips.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 rounded-xl font-semibold text-white 
                      ${isDarkMode 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                      } shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    Get Started Now
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 rounded-xl font-semibold border-2 
                      ${isDarkMode
                        ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                      } transition-all duration-300`}
                  >
                    Learn More
                  </motion.button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-12 grid grid-cols-2 gap-6"
                >
                  {Object.entries(projectInfo.statistics).slice(0, 2).map(([key, value], index) => (
                    <div key={index} className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                    } backdrop-blur-sm`}>
                      <h4 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {value}
                      </h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Feature Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {[
                  {
                    icon: Brain,
                    title: 'AI-Powered Diagnostics',
                    description: 'Advanced algorithms ensure precise medical analysis',
                    color: 'emerald'
                  },
                  {
                    icon: Heart,
                    title: 'Personalized Care',
                    description: 'Tailored healthcare plans for your unique needs',
                    color: 'teal'
                  },
                  {
                    icon: Shield,
                    title: 'Secure & Private',
                    description: 'Your health data is protected with encryption',
                    color: 'cyan'
                  },
                  {
                    icon: Users,
                    title: '24/7 Support',
                    description: 'Round-the-clock medical assistance',
                    color: 'blue'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * (index + 1) }}
                    className={`p-6 rounded-2xl backdrop-blur-sm ${
                      isDarkMode 
                        ? 'bg-gray-800/40 hover:bg-gray-800/60' 
                        : 'bg-white/40 hover:bg-white/60'
                    } transition-all duration-300 group`}
                  >
                    <feature.icon className={`w-10 h-10 mb-4 ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M0 200L60 186.7C120 173.3 240 146.7 360 133.3C480 120 600 120 720 133.3C840 146.7 960 173.3 1080 166.7C1200 160 1320 120 1380 100L1440 80V200H1380C1320 200 1200 200 1080 200C960 200 840 200 720 200C600 200 480 200 360 200C240 200 120 200 60 200H0Z" 
              fill={isDarkMode ? '#111827' : '#F9FAFB'}
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Comprehensive Healthcare Solutions
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience the future of healthcare with our innovative features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-750' 
                    : 'bg-white hover:bg-gray-50'
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className={`w-12 h-12 rounded-full ${
                  isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                } flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Services
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive healthcare services tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-64 rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute inset-0 flex flex-col justify-end p-6 ${
                  isDarkMode 
                    ? 'bg-gradient-to-t from-gray-900 to-transparent' 
                    : 'bg-gradient-to-t from-black to-transparent'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <service.icon className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-semibold text-white">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-200">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(projectInfo.statistics).map(([key, value], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-8 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {value}
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070"
            alt="Background Pattern"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className={`text-4xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join thousands of satisfied users who have chosen VirtualDoctor for their healthcare needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-xl font-semibold text-white 
                ${isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              Get Started Now
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;