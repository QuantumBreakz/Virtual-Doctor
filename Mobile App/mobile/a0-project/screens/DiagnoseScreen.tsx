import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors, spacing, typography } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { diagnosisService } from '../utils/api';
import Toast from 'react-native-toast-message';

type DiagnoseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Diagnose'>;

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

export default function DiagnoseScreen() {
  const navigation = useNavigation<DiagnoseScreenNavigationProp>();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [currentDuration, setCurrentDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSymptom = () => {
    if (!currentSymptom.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a symptom',
      });
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: currentSymptom.trim(),
      severity: currentSeverity,
      duration: currentDuration.trim(),
    };

    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom('');
    setCurrentDuration('');
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter(symptom => symptom.id !== id));
  };

  const handleGetDiagnosis = async () => {
    if (symptoms.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add at least one symptom',
      });
      return;
    }

    setIsLoading(true);
    try {
      const symptomList = symptoms.map(s => s.name);
      const diagnosis = await diagnosisService.getDiagnosis(symptomList);
      
      // Navigate to diagnosis result screen
      navigation.navigate('Prescription', { diagnosisId: diagnosis.id });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to get diagnosis',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeverityButton = (severity: 'mild' | 'moderate' | 'severe', label: string) => (
    <TouchableOpacity
      style={[
        styles.severityButton,
        currentSeverity === severity && styles.severityButtonActive,
      ]}
      onPress={() => setCurrentSeverity(severity)}
    >
      <Text
        style={[
          styles.severityButtonText,
          currentSeverity === severity && styles.severityButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Symptom Checker</Text>
        <Text style={styles.subtitle}>
          Add your symptoms to get an AI-powered diagnosis
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter symptom"
          value={currentSymptom}
          onChangeText={setCurrentSymptom}
        />

        <View style={styles.severityContainer}>
          <Text style={styles.label}>Severity:</Text>
          <View style={styles.severityButtons}>
            {renderSeverityButton('mild', 'Mild')}
            {renderSeverityButton('moderate', 'Moderate')}
            {renderSeverityButton('severe', 'Severe')}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Duration (e.g., 2 days, 1 week)"
          value={currentDuration}
          onChangeText={setCurrentDuration}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddSymptom}
        >
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add Symptom</Text>
        </TouchableOpacity>
      </View>

      {symptoms.length > 0 && (
        <View style={styles.symptomsList}>
          <Text style={styles.sectionTitle}>Added Symptoms</Text>
          {symptoms.map((symptom) => (
            <View key={symptom.id} style={styles.symptomItem}>
              <View style={styles.symptomInfo}>
                <Text style={styles.symptomName}>{symptom.name}</Text>
                <View style={styles.symptomDetails}>
                  <Text style={styles.symptomDetail}>
                    Severity: {symptom.severity}
                  </Text>
                  <Text style={styles.symptomDetail}>
                    Duration: {symptom.duration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveSymptom(symptom.id)}
              >
                <Ionicons name="close" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.diagnoseButton, isLoading && styles.buttonDisabled]}
        onPress={handleGetDiagnosis}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Ionicons name="medical" size={24} color={colors.white} />
            <Text style={styles.diagnoseButtonText}>Get Diagnosis</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.white,
    opacity: 0.8,
  },
  inputContainer: {
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
  severityContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  severityButtonActive: {
    backgroundColor: colors.primary,
  },
  severityButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[800],
  },
  severityButtonTextActive: {
    color: colors.white,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.sm,
  },
  symptomsList: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  symptomItem: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  symptomDetails: {
    flexDirection: 'row',
  },
  symptomDetail: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginRight: spacing.md,
  },
  removeButton: {
    padding: spacing.xs,
  },
  diagnoseButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    margin: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  diagnoseButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.sm,
  },
}); 