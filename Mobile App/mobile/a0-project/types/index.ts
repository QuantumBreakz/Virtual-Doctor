export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

export interface DiagnosticResult {
  confidence: number;
  possibleConditions: string[];
  recommendations: string[];
  shouldSeekImmediateCare: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Diagnosis {
  id: string;
  userId: string;
  symptoms: string[];
  diagnosis: string;
  confidence: number;
  timestamp: string;
}

export interface Prescription {
  id: string;
  userId: string;
  diagnosisId: string;
  medicines: Medicine[];
  dosage: string;
  instructions: string;
  timestamp: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  dosage: string;
  sideEffects: string[];
}

export interface Therapy {
  id: string;
  userId: string;
  type: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  repetitions: number;
}

export interface Consultation {
  id: string;
  userId: string;
  doctorId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export type RootStackParamList = {
  // Auth Stack
  Auth: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  
  // Main Stack
  Home: undefined;
  Dashboard: undefined;
  Diagnose: undefined;
  Emotions: undefined;
  Medicine: undefined;
  MedicineDescription: { medicineId: string };
  AIChat: undefined;
  Tools: undefined;
  Solution: undefined;
  ProjectEstimation: undefined;
  
  // Profile Stack
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  
  // Medical Stack
  Consultation: undefined;
  Prescription: { diagnosisId: string };
  Therapy: undefined;
  MedicalHistory: undefined;
  EmergencyContacts: undefined;
};