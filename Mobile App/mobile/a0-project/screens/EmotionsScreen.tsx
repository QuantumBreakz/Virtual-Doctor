import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, spacing, typography } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { emotionsService } from '../utils/api';
import Toast from 'react-native-toast-message';

const emotions = [
  { id: 'happy', label: 'Happy', icon: 'happy', color: colors.success },
  { id: 'calm', label: 'Calm', icon: 'leaf', color: colors.primary },
  { id: 'anxious', label: 'Anxious', icon: 'alert', color: colors.warning },
  { id: 'sad', label: 'Sad', icon: 'sad', color: colors.danger },
  { id: 'angry', label: 'Angry', icon: 'flame', color: colors.danger },
  { id: 'tired', label: 'Tired', icon: 'moon', color: colors.gray[600] },
];

export default function EmotionsScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
  };

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an emotion',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await emotionsService.logEmotion({
        emotion: selectedEmotion,
        intensity,
        note,
        timestamp: new Date(),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Emotion logged successfully',
      });

      // Reset form
      setSelectedEmotion('');
      setIntensity(5);
      setNote('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to log emotion',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>
          Select your current emotion and intensity level
        </Text>
      </View>

      <View style={styles.emotionsGrid}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion.id && styles.emotionButtonSelected,
              { borderColor: emotion.color },
            ]}
            onPress={() => handleEmotionSelect(emotion.id)}
          >
            <Ionicons
              name={emotion.icon}
              size={32}
              color={selectedEmotion === emotion.id ? colors.white : emotion.color}
            />
            <Text
              style={[
                styles.emotionLabel,
                selectedEmotion === emotion.id && styles.emotionLabelSelected,
              ]}
            >
              {emotion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intensity Level</Text>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>Low</Text>
          <View style={styles.intensitySlider}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.intensityDot,
                  intensity >= value && styles.intensityDotActive,
                ]}
                onPress={() => handleIntensityChange(value)}
              />
            ))}
          </View>
          <Text style={styles.intensityLabel}>High</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="How are you feeling? What's on your mind?"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Ionicons name="save" size={24} color={colors.white} />
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Saving...' : 'Save Emotion Log'}
        </Text>
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
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  emotionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  emotionButtonSelected: {
    backgroundColor: colors.primary,
  },
  emotionLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[800],
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emotionLabelSelected: {
    color: colors.white,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intensityLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[600],
  },
  intensitySlider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  intensityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },
  intensityDotActive: {
    backgroundColor: colors.primary,
  },
  noteInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[800],
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    margin: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.sm,
  },
}); 