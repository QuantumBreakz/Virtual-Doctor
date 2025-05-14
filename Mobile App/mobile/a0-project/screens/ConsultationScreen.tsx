import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-audio';

export default function ConsultationScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const navigation = useNavigation();

  const startConsultation = () => {
    // Here we would normally process the symptoms and start the consultation
    navigation.navigate('Results');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#059669" />
        </TouchableOpacity>
        <Text style={styles.title}>Virtual Consultation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe Your Symptoms</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Please describe what you're experiencing..."
            value={symptoms}
            onChangeText={setSymptoms}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Description</Text>
          <TouchableOpacity 
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={() => setIsRecording(!isRecording)}
          >
            <MaterialIcons 
              name={isRecording ? "stop" : "mic"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.recordButtonText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startConsultation}>
          <Text style={styles.startButtonText}>Start Consultation</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This virtual consultation is powered by AI and should not replace professional medical advice. 
          If you're experiencing severe symptoms, please seek immediate medical attention.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669'
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  recordButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8
  },
  recordingButton: {
    backgroundColor: '#dc2626'
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  startButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  disclaimer: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14
  }
});