import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);
  const subtitleTranslateY = new Animated.Value(50);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 10,
        friction: 2,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 20,
        }),
      ]),
    ]).start(() => {
      setTimeout(onFinish, 800);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <MaterialIcons name="health-and-safety" size={80} color="#059669" />
      </Animated.View>
      
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Virtual Therapist
      </Animated.Text>
      
      <Animated.Text 
        style={[
          styles.subtitle, 
          { 
            opacity: titleOpacity,
            transform: [{ translateY: subtitleTranslateY }]
          }
        ]}
      >
        Your AI-Powered Mental Health Companion
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});