import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Diagnose: undefined;
  AIChat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  Dashboard: undefined;
  Emotions: undefined;
  Medicine: undefined;
  MedicineDescription: undefined;
  Tools: undefined;
  Solution: undefined;
  ProjectEstimation: undefined;
  Settings: undefined;
  Consultation: undefined;
  Prescription: undefined;
  Therapy: undefined;
  // Add tab screens to root stack for deep linking
  Home: undefined;
  Diagnose: undefined;
  AIChat: undefined;
  Profile: undefined;
};

export type AppStackParamList = RootStackParamList & TabParamList; 