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
  const [error, setError] = useState<string | null>(null);
  
  
  const modelConfig = {
    endpoint: 'http://localhost:11434/api/generate',
    model: 'llama3.2',
    systemPrompt: `You are an AI medical assistant. Based on the symptoms provided, suggest a possible condition and recommend appropriate medications.
    
    Important:
    1. Provide realistic suggestions BUT ALWAYS add a disclaimer that these are information-only, not medical advice.
    2. Format your response as a valid JSON object with the following structure:
    {
      "condition": "Medical condition name",
      "medications": [
        {
          "id": 1,
          "name": "Medication name",
          "dosage": "Dosage information",
          "frequency": "How often to take",
          "duration": "How long to take",
          "supervisedUse": boolean (true/false),
          "imageUrl": "/api/placeholder/150/100",
          "sideEffects": ["Side effect 1", "Side effect 2", "Side effect 3"]
        }
      ]
    }
    3. Always include 2-3 medications for the condition.
    4. Always return valid JSON that can be parsed with JSON.parse()`
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  // Function to get response from local LLM via Ollama
  const getResponseFromLocalLLM = async (userSymptoms: string) => {
    try {
      setError(null);
      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig.model,
          prompt: `${modelConfig.systemPrompt}\n\nSymptoms: ${userSymptoms}\n\nProvide your response in valid JSON format only.`,
          stream: false,
        }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const llmResponse = data.response || '';

      // Find JSON in the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON ");
      }

      try {
        // Parse the extracted JSON
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse;
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("The malformed JSON");
      }
    } catch (error) {
      console.error('Error fetching :', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!formData.symptoms.trim()) {
        throw new Error("Please describe your symptoms");
      }

      // Get response from LLM
      const llmResponse = await getResponseFromLocalLLM(formData.symptoms);
      
      // Set condition and medications from the LLM response
      setCondition(llmResponse.condition);
      
      // Ensure all required fields are present in each medication object
      const validatedMedications = llmResponse.medications.map((med: any, index: number) => {
        return {
          id: med.id || index + 1,
          name: med.name || "Unknown Medication",
          dosage: med.dosage || "As directed",
          frequency: med.frequency || "As needed",
          duration: med.duration || "As recommended",
          supervisedUse: Boolean(med.supervisedUse),
          imageUrl: med.imageUrl || "/api/placeholder/150/100",
          sideEffects: Array.isArray(med.sideEffects) ? med.sideEffects : ["Unknown"]
        };
      });
      
      setMedications(validatedMedications);
      setShowResult(true);
    } catch (error: any) {
      console.error("Error processing symptoms:", error);
      setError(error.message || "Failed to process your symptoms. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback to mock data if LLM response fails
  const useMockData = () => {
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
      }
    ];

    setCondition(mockCondition);
    setMedications(mockMedications);
    setShowResult(true);
    setIsSubmitting(false);
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

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {error}
                    </p>
                  </div>
                )}

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    This tool provides general information only. It should not be used for diagnosis
                    or as a substitute for professional medical advice. Any medication information
                    is for educational purposes only.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.symptoms.trim()}
                    className="md:flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  
                  
                </div>
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