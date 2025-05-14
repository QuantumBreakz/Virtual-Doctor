import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { Button } from '../components/Button';
import { toast } from 'sonner-native';

interface Question {
  id: number;
  question: string;
  answer: string;
}

export default function LLMPrescriptionScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState('');

  const questions: Question[] = [
    { id: 1, question: "What symptoms are you experiencing?", answer: '' },
    { id: 2, question: "How long have you had these symptoms?", answer: '' },
    { id: 3, question: "Any known allergies to medications?", answer: '' },
    { id: 4, question: "Are you currently taking any other medications?", answer: '' },
  ];

  const [answers, setAnswers] = useState<Question[]>(questions);

  const handleAnswerChange = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep].answer = text;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentStep].answer.trim() === '') {
      toast.error('Please provide an answer before continuing');
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePrescription();
    }
  };

  const generatePrescription = async () => {
    setLoading(true);
    try {
      const promptText = `Based on the following patient information, suggest appropriate medication and dosage:
        ${answers.map(q => `${q.question} ${q.answer}`).join('\n')}
        Please provide a safe and conservative recommendation.`;

      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful medical assistant. Always be conservative with recommendations and include appropriate disclaimers.' },
            { role: 'user', content: promptText }
          ]
        })
      });

      const data = await response.json();
      setPrescription(data.completion);
    } catch (error) {
      toast.error('Failed to generate prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {!prescription ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {questions[currentStep].question}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border
              }]}
              multiline
              value={answers[currentStep].answer}
              onChangeText={handleAnswerChange}
              placeholder="Type your answer here..."
              placeholderTextColor={colors.text + '80'}
            />
            <Button
              title={currentStep < questions.length - 1 ? "Next" : "Get Recommendation"}
              onPress={handleNext}
            />
            <Text style={[styles.stepIndicator, { color: colors.text }]}>
              Step {currentStep + 1} of {questions.length}
            </Text>
          </View>
        ) : (
          <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              AI Recommendation
            </Text>
            <Text style={[styles.resultText, { color: colors.text }]}>
              {prescription}
            </Text>
            <View style={styles.warningBox}>
              <MaterialCommunityIcons name="alert" size={24} color={colors.warning} />
              <Text style={[styles.warningText, { color: colors.text }]}>
                This is an AI-generated recommendation. Please consult with a healthcare professional before taking any medication.
              </Text>
            </View>
            <Button
              title="Start Over"
              onPress={() => {
                setCurrentStep(0);
                setPrescription('');
                setAnswers(questions);
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  stepIndicator: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    opacity: 0.7,
  },
  resultCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,193,7,0.1)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
});