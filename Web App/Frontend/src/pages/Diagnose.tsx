import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  ChevronRight, 
  AlertCircle, 
  Camera, 
  X, 
  Upload, 
  CheckCircle,
  Brain,
  Activity,
  Thermometer,
  Heart
} from 'lucide-react';

const Diagnose = () => {
  const [symptoms, setSymptoms] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const commonSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Shortness of breath',
    'Body aches',
    'Sore throat',
    'Chills'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const image = canvas.toDataURL('image/jpeg');
      setCapturedImage(image);
      stopCamera();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsAnalyzing(false);
  };

  const vitalSigns = [
    { icon: Heart, label: 'Heart Rate', value: '72 bpm', status: 'normal' },
    { icon: Thermometer, label: 'Temperature', value: '98.6°F', status: 'normal' },
    { icon: Activity, label: 'Blood Pressure', value: '120/80', status: 'normal' },
    { icon: Brain, label: 'Neural Activity', value: 'Normal', status: 'normal' }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Stethoscope className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Diagnosis
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Get instant analysis of your symptoms using advanced AI
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Common Symptoms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom, index) => (
                      <button
                        key={index}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedSymptoms.includes(symptom)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe Additional Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    rows={5}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Please provide any additional symptoms or concerns..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>

                <AnimatePresence>
                  {showCamera && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-xl overflow-hidden"
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-xl"
                      />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                        <button
                          onClick={captureImage}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          Capture
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {capturedImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full rounded-xl"
                    />
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {vitalSigns.map((vital, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <vital.icon className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {vital.label}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {vital.value}
                        </div>
                        <div className="text-sm text-emerald-500">
                          {vital.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">
                    This AI-powered analysis is for preliminary assessment only. Always consult with a healthcare professional for accurate medical advice.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      Get AI Diagnosis
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Analysis Complete
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-gray-700 dark:text-gray-300">
                          Primary Assessment: Upper Respiratory Infection
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-gray-700 dark:text-gray-300">
                          Confidence Level: 92%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <p className="text-gray-700 dark:text-gray-300">
                          Recommended Action: Schedule Telemedicine Consultation
                        </p>
                      </div>
                    </div>

                    <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-600 text-emerald-500 dark:text-emerald-400 py-3 rounded-lg border border-emerald-500 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-500 transition-colors">
                      Schedule Consultation
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Diagnose;