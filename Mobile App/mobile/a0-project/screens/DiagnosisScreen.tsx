import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DiagnosisScreen() {
  const [hasPermission, setHasPermission] = useState(null);  const [type, setType] = useState(CameraType.front);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const startAnalysis = async () => {
    if (cameraRef.current) {
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        navigation.navigate('Results');
      }, 3000);
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#059669" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Diagnosis</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {                setType(
                  type === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                );
              }}>
              <MaterialIcons name="flip-camera-ios" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.analyzeButton, isAnalyzing && styles.analyzingButton]}
          onPress={startAnalysis}
          disabled={isAnalyzing}
        >
          <Text style={styles.analyzeButtonText}>
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        Position your face clearly in the frame for accurate analysis
      </Text>
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
  cameraContainer: {
    flex: 1,
    marginVertical: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden'
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  flipButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  controls: {
    padding: 16
  },
  analyzeButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  analyzingButton: {
    backgroundColor: '#64748b'
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  disclaimer: {
    textAlign: 'center',
    color: '#64748b',
    padding: 16,
    fontSize: 14
  },
  permissionButton: {
    backgroundColor: '#059669',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    margin: 16
  }
});