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
import { medicationService } from '../utils/api';
import Toast from 'react-native-toast-message';

export default function MedicineDescriptionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [medication, setMedication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMedicationDetails();
  }, []);

  const fetchMedicationDetails = async () => {
    try {
      const result = await medicationService.getMedicationDetails(route.params.medicationId);
      setMedication(result);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch medication details',
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

  if (!medication) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{medication.name}</Text>
        <Text style={styles.genericName}>{medication.genericName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Instructions</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="medical" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dosage</Text>
              <Text style={styles.infoValue}>{medication.dosage}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{medication.frequency}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{medication.duration}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{medication.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Side Effects</Text>
        {medication.sideEffects.map((effect, index) => (
          <View key={index} style={styles.sideEffectItem}>
            <Ionicons name="warning" size={20} color={colors.warning} />
            <Text style={styles.sideEffectText}>{effect}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Precautions</Text>
        {medication.precautions.map((precaution, index) => (
          <View key={index} style={styles.precautionItem}>
            <Ionicons name="alert-circle" size={20} color={colors.primary} />
            <Text style={styles.precautionText}>{precaution}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactions</Text>
        {medication.interactions.map((interaction, index) => (
          <View key={index} style={styles.interactionItem}>
            <Ionicons name="swap-horizontal" size={20} color={colors.danger} />
            <Text style={styles.interactionText}>{interaction}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={24} color={colors.gray[600]} />
        <Text style={styles.disclaimerText}>
          This information is for reference only. Always consult with your healthcare provider before taking any medication.
        </Text>
      </View>
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
    marginBottom: spacing.xs,
  },
  genericName: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.white,
    opacity: 0.8,
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
  infoCard: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[800],
  },
  description: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    lineHeight: 24,
  },
  sideEffectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sideEffectText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  precautionText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  interactionText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    padding: spacing.lg,
    margin: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
}); 