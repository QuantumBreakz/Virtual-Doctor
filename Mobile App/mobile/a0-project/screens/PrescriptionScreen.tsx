import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { diagnosisService } from '../utils/api';
import Toast from 'react-native-toast-message';

export default function PrescriptionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiagnosis();
  }, []);

  const fetchDiagnosis = async () => {
    try {
      const result = await diagnosisService.getDiagnosisDetails(route.params.diagnosisId);
      setDiagnosis(result);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch diagnosis details',
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!diagnosis) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnosis Results</Text>
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Severity:</Text>
          <Text style={[styles.severityValue, styles[`severity${diagnosis.severity}`]]}>
            {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Condition</Text>
        <Text style={styles.condition}>{diagnosis.condition}</Text>
        <Text style={styles.description}>{diagnosis.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prescribed Medications</Text>
        {diagnosis.medications.map((medication) => (
          <TouchableOpacity
            key={medication.id}
            style={styles.medicationCard}
            onPress={() => navigation.navigate('MedicineDescription', { medicationId: medication.id })}
          >
            <View style={styles.medicationHeader}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Ionicons name="chevron-forward" size={24} color={colors.gray[600]} />
            </View>
            <View style={styles.medicationDetails}>
              <Text style={styles.medicationDetail}>
                <Text style={styles.detailLabel}>Dosage: </Text>
                {medication.dosage}
              </Text>
              <Text style={styles.medicationDetail}>
                <Text style={styles.detailLabel}>Frequency: </Text>
                {medication.frequency}
              </Text>
              <Text style={styles.medicationDetail}>
                <Text style={styles.detailLabel}>Duration: </Text>
                {medication.duration}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {diagnosis.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Prescription saved to your history',
          });
          navigation.navigate('Dashboard');
        }}
      >
        <Ionicons name="save" size={24} color={colors.white} />
        <Text style={styles.saveButtonText}>Save to History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
    marginRight: spacing.sm,
  },
  severityValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  severitymild: {
    backgroundColor: colors.success,
    color: colors.white,
  },
  severitymoderate: {
    backgroundColor: colors.warning,
    color: colors.white,
  },
  severitysevere: {
    backgroundColor: colors.danger,
    color: colors.white,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  condition: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    lineHeight: 24,
  },
  medicationCard: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  medicationName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[800],
  },
  medicationDetails: {
    marginTop: spacing.xs,
  },
  medicationDetail: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[800],
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recommendationText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    margin: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.sm,
  },
});