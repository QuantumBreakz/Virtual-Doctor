import {
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, limit, getDocs, writeBatch } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as UserType, Diagnosis, Prescription, Therapy, Consultation } from '../types';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

const API_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class Api {
  private static instance: Api;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  private async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (this.token) {
      headers.append('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
        status: response.status
      };
    }

    return {
      data,
      status: response.status
    };
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ email, password })
      });

      const result = await this.handleResponse<{ token: string; user: User }>(response);
      
      if (result.data) {
        this.token = result.data.token;
        await AsyncStorage.setItem('token', result.data.token);
      }

      return result;
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(userData)
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async getDiagnosis(symptoms: string[]): Promise<ApiResponse<Diagnosis>> {
    try {
      const response = await fetch(`${API_URL}/diagnosis`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ symptoms })
      });

      return await this.handleResponse<Diagnosis>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async getPrescription(diagnosisId: string): Promise<ApiResponse<Prescription>> {
    try {
      const response = await fetch(`${API_URL}/prescription/${diagnosisId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      return await this.handleResponse<Prescription>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async getTherapies(): Promise<ApiResponse<Therapy[]>> {
    try {
      const response = await fetch(`${API_URL}/therapies`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      return await this.handleResponse<Therapy[]>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async scheduleConsultation(doctorId: string, date: string): Promise<ApiResponse<Consultation>> {
    try {
      const response = await fetch(`${API_URL}/consultations`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ doctorId, date })
      });

      return await this.handleResponse<Consultation>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(userData)
      });

      return await this.handleResponse<User>(response);
    } catch (error) {
      return {
        error: 'Network error',
        status: 500
      };
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('token');
  }
}

export const api = Api.getInstance();

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      return {
        user: userCredential.user,
        userData: userDoc.data()
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  googleSignIn: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if first time
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }
      
      return {
        user,
        userData: userDoc.data()
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  register: async (userData: Partial<UserProfile>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email!, userData.password!);
      
      // Remove password from userData before storing
      const { password, ...userDataToStore } = userData;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userDataToStore,
        id: userCredential.user.uid,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      return {
        user: userCredential.user,
        userData: userDataToStore
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

// Emotional Analysis
export const emotionService = {
  analyzeEmotion: async (imageUri: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emotion/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUri }),
      });
      return await response.json();
    } catch (error) {
      console.error('Emotion analysis error:', error);
      throw error;
    }
  },
};

// Medical Diagnosis
export const diagnosisService = {
  getDiagnosis: async (symptoms: string[]) => {
    try {
      const diagnosisRef = await addDoc(collection(db, 'diagnoses'), {
        symptoms,
        timestamp: new Date(),
        status: 'pending',
      });
      return { id: diagnosisRef.id };
    } catch (error) {
      console.error('Diagnosis error:', error);
      throw error;
    }
  },

  getDiagnosisDetails: async (diagnosisId: string) => {
    try {
      const diagnosisDoc = await getDoc(doc(db, 'diagnoses', diagnosisId));
      if (!diagnosisDoc.exists()) {
        throw new Error('Diagnosis not found');
      }
      return diagnosisDoc.data();
    } catch (error) {
      console.error('Diagnosis details error:', error);
      throw error;
    }
  },
};

// Prescription Management
export const prescriptionService = {
  getPrescriptionRecommendation: async (condition: string, patientHistory: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant. Provide conservative medication recommendations.',
            },
            {
              role: 'user',
              content: `Given the condition "${condition}" and patient history, what would be appropriate medication options?`,
            },
          ],
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Prescription error:', error);
      throw error;
    }
  },
};

export const medicationService = {
  getMedicationDetails: async (medicationId: string) => {
    try {
      const medicationDoc = await getDoc(doc(db, 'medications', medicationId));
      if (!medicationDoc.exists()) {
        throw new Error('Medication not found');
      }
      return medicationDoc.data();
    } catch (error) {
      console.error('Medication details error:', error);
      throw error;
    }
  },

  searchMedications: async (query: string) => {
    try {
      // Implement medication search logic
      return [];
    } catch (error) {
      console.error('Medication search error:', error);
      throw error;
    }
  },

  getMedicationInteractions: async (medicationIds: string[]) => {
    try {
      // Implement medication interactions check
      return [];
    } catch (error) {
      console.error('Medication interactions error:', error);
      throw error;
    }
  },
};

export const emotionsService = {
  logEmotion: async (emotionData: {
    emotion: string;
    intensity: number;
    note?: string;
    timestamp: Date;
  }) => {
    try {
      const emotionRef = await addDoc(collection(db, 'emotions'), {
        ...emotionData,
        userId: auth.currentUser?.uid,
      });
      return { id: emotionRef.id };
    } catch (error) {
      throw error;
    }
  },

  getEmotionHistory: async (startDate: Date, endDate: Date) => {
    try {
      // Implement emotion history retrieval
      return [];
    } catch (error) {
      throw error;
    }
  },

  getEmotionStats: async () => {
    try {
      // Implement emotion statistics calculation
      return {
        mostFrequent: '',
        averageIntensity: 0,
        totalEntries: 0,
      };
    } catch (error) {
      throw error;
    }
  },
};

export const chatService = {
  sendMessage: async (message: string) => {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        message,
        userId: auth.currentUser?.uid,
        timestamp: new Date(),
        sender: 'user',
      });

      // Simulate AI response (replace with actual AI integration)
      const aiResponse = {
        message: 'This is a simulated AI response. Replace with actual AI integration.',
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'chats'), {
        ...aiResponse,
        userId: auth.currentUser?.uid,
        sender: 'ai',
      });

      return aiResponse;
    } catch (error) {
      throw error;
    }
  },

  getChatHistory: async () => {
    try {
      const chatRef = collection(db, 'chats');
      const q = query(
        chatRef,
        where('userId', '==', auth.currentUser?.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  },

  clearChatHistory: async () => {
    try {
      const chatRef = collection(db, 'chats');
      const q = query(chatRef, where('userId', '==', auth.currentUser?.uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      throw error;
    }
  },
};