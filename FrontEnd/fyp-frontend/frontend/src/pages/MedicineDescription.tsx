import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, Pill, ArrowLeft, Clock, Shield, Calendar } from 'lucide-react';

interface FormData {
  symptoms: string;
  image: File | null;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  supervisedUse: boolean;
  imageUrl: string;
  sideEffects: string[];
}

const MedicineDescription = () => {
  const [formData, setFormData] = useState<FormData>({
    symptoms: '',
    image: null
  });
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [condition, setCondition] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This would be replaced with actual API call to ML model
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response from ML model
      const mockCondition = "Upper Respiratory Infection";
      const mockMedications: Medication[] = [
        {
          id: 1,
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Every 8 hours",
          duration: "7 days",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Diarrhea", "Rash", "Nausea"]
        },
        {
          id: 2,
          name: "Azithromycin",
          dosage: "250mg",
          frequency: "Once daily",
          duration: "5 days",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Stomach pain", "Diarrhea", "Headache"]
        },
        {
          id: 3,
          name: "Dextromethorphan",
          dosage: "30mg",
          frequency: "Every 6-8 hours as needed",
          duration: "As needed",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Drowsiness", "Dizziness"]
        },
        {
          id: 4,
          name: "Pseudoephedrine",
          dosage: "60mg",
          frequency: "Every 4-6 hours",
          duration: "Not exceeding 7 days",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Insomnia", "Nervousness", "Increased heart rate"]
        },
        {
          id: 5,
          name: "Guaifenesin",
          dosage: "400mg",
          frequency: "Every 4 hours",
          duration: "As needed",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Nausea", "Vomiting", "Stomach pain"]
        },
        {
          id: 6,
          name: "Acetaminophen",
          dosage: "500mg",
          frequency: "Every 6 hours as needed",
          duration: "As needed",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Liver damage (with high doses)", "Allergic reactions"]
        },
        {
          id: 7,
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "Every 6-8 hours with food",
          duration: "Not exceeding 10 days",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Stomach pain", "Heartburn", "Dizziness"]
        },
        {
          id: 8,
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "As needed",
          supervisedUse: false,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"]
        },
        {
          id: 9,
          name: "Fluticasone Nasal Spray",
          dosage: "1-2 sprays per nostril",
          frequency: "Once daily",
          duration: "As directed",
          supervisedUse: true,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Nose bleeds", "Headache", "Sore throat"]
        },
        {
          id: 10,
          name: "Benzonatate",
          dosage: "200mg",
          frequency: "Three times daily",
          duration: "7-10 days",
          supervisedUse: true,
          imageUrl: "/api/placeholder/150/100",
          sideEffects: ["Dizziness", "Headache", "Stuffy nose"]
        }
      ];

      setCondition(mockCondition);
      setMedications(mockMedications);
      
      setIsSubmitting(false);
      setShowResult(true);
    } catch (error) {
      console.error("Error processing symptoms:", error);
      setIsSubmitting(false);
      // Handle error state
    }
  };

  return (
    <div className="min-h-screen pt-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        >
          {!showResult ? (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Pill className="w-8 h-8 text-green-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Medicine Description System
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="symptoms"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Describe your symptoms in detail
                  </label>
                  <textarea
                    id="symptoms"
                    rows={5}
                    value={formData.symptoms}
                    onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Please provide detailed information about your symptoms (e.g., fever, cough, how long you've had them, etc)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload relevant images (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-green-500 hover:text-green-400"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    This tool provides general information only. It should not be used for diagnosis
                    or as a substitute for professional medical advice. Any medication information
                    is for educational purposes only.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.symptoms.trim()}
                  className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing symptoms...
                    </>
                  ) : (
                    'Analyze Symptoms & Suggest Medications'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <button
                onClick={() => setShowResult(false)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Analysis Results
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Potential Condition
                    </h3>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {condition}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Recommended Medications
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                      Based on symptoms
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {medications.map((med) => (
                      <div 
                        key={med.id}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 p-4 flex justify-center items-center bg-gray-50 dark:bg-gray-800">
                            <img 
                              src={med.imageUrl} 
                              alt={med.name} 
                              className="h-24 w-auto object-contain"
                            />
                          </div>
                          <div className="md:w-3/4 p-6">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                {med.name}
                              </h4>
                              {med.supervisedUse && (
                                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Medical supervision advised
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-blue-500" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Dosage</p>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{med.dosage}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{med.frequency}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{med.duration}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Possible side effects:</p>
                              <div className="flex flex-wrap gap-1">
                                {med.sideEffects.map((effect, index) => (
                                  <span 
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded"
                                  >
                                    {effect}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    This is an AI-generated analysis for informational purposes only. These medication suggestions are not a prescription. 
                    Please consult with a healthcare professional before taking any medication.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineDescription;