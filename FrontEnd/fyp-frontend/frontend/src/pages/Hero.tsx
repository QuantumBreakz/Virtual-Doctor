import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Brain, Laptop, Users, ChevronRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import projectInfo from '../data/projectInfo.json';

interface HeroProps {
  isDarkMode: boolean;
}

// Stylized 3D Heartbeat Wave
const HeartbeatWave = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.08;
    }
  });

  const points = [];
  for (let i = 0; i < 60; i++) {
    const x = (i - 30) * 0.1;
    const y = i % 10 === 0 ? 0.5 : Math.sin(i * 0.5) * 0.2;
    points.push(new THREE.Vector3(x, y, 0));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
        <meshPhysicalMaterial
          color={isDarkMode ? '#34d399' : '#10b981'}
          roughness={0.2}
          metalness={0.4}
          clearcoat={1}
          emissive={isDarkMode ? '#34d399' : '#10b981'}
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        color={isDarkMode ? '#34d399' : '#10b981'}
        intensity={1}
        distance={10}
      />
      <Environment preset={isDarkMode ? 'night' : 'sunset'} background={false} blur={0.4} />
    </group>
  );
};

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const [ref, inView] = useInView({ threshold: 0.3 });

  const features = [
    { Icon: Activity, title: 'AI Precision', description: 'Unrivaled accuracy in every diagnosis.' },
    { Icon: Brain, title: 'Total Wellness', description: 'Care that nurtures body and soul.' },
    { Icon: Laptop, title: 'Seamless Insights', description: 'Your health, beautifully connected.' },
    { Icon: Users, title: 'Global Access', description: 'Empowering lives, everywhere.' },
  ];

  return (
    <section className={`relative min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-colors duration-500 overflow-hidden`}>
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-teal-950 to-emerald-950 opacity-90' : 'bg-gradient-to-br from-white via-teal-50 to-emerald-50 opacity-80'}`} />
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,${isDarkMode ? '0.2' : '0.15'})_0%,transparent_70%)] opacity-60`} />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(52,211,153,${isDarkMode ? '0.15' : '0.1'}), transparent)`,
        }}
      />

      <motion.div style={{ y }} className="relative z-10 pt-36 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -80 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500`}>
                  Healing
                </span>
                <span> Reimagined</span>
              </h1>
              <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-12 max-w-2xl leading-relaxed font-medium`}>
                Discover a world where healthcare transcends boundaries. VirtualDoctor blends cutting-edge AI with heartfelt care, offering you precision, connection, and a path to vibrant health—anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-9 py-4 ${isDarkMode ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'} text-white font-semibold rounded-xl shadow-xl transition-all duration-300`}
                >
                  Experience Now <ChevronRight className="w-5 h-5 inline ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-9 py-4 ${isDarkMode ? 'border-emerald-400 text-emerald-400 hover:bg-emerald-400/15' : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'} border-2 font-semibold rounded-xl transition-all duration-300`}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              className="h-64 sm:h-80 lg:h-[32rem] relative"
            >
              <Canvas shadows>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[5, 5, 5]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
                  <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
                  <HeartbeatWave isDarkMode={isDarkMode} />
                </Suspense>
              </Canvas>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-16"
        >
          Your Health, Our Passion
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 1, delay: index * 0.3, ease: 'easeOut' }}
              whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
              className={`${isDarkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white border-gray-200/50'} p-7 rounded-2xl border shadow-xl transition-all duration-300`}
            >
              <feature.Icon className={`w-12 h-12 mb-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed font-medium`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-16"
        >
          Making a Difference
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
          {Object.entries(projectInfo.statistics).map(([key, value], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 1, delay: index * 0.3, ease: 'easeOut' }}
              className={`${isDarkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white border-gray-200/50'} p-7 rounded-2xl border shadow-xl`}
            >
              <h4 className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} mb-2`}>
                {value}
              </h4>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed font-medium`}>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;