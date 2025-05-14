import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const features = [
    {
      title: 'AI Therapy',
      icon: <MaterialIcons name="psychology" size={32} color={isDark ? '#4ADE80' : '#059669'} />,
      description: 'Start virtual therapy session',
      screen: 'Therapy'
    },
    {
      title: 'Emotion Analysis',
      icon: <MaterialIcons name="face" size={32} color={isDark ? '#4ADE80' : '#059669'} />,
      description: 'Analyze emotional state',
      screen: 'Diagnosis'
    },
    {
      title: 'Prescriptions',
      icon: <MaterialIcons name="medical-services" size={32} color={isDark ? '#4ADE80' : '#059669'} />,
      description: 'Get medicine recommendations',
      screen: 'LLMPrescription'
    },
    {
      title: 'Profile',
      icon: <MaterialIcons name="person" size={32} color={isDark ? '#4ADE80' : '#059669'} />,
      description: 'View your progress',
      screen: 'Profile'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isDark && styles.darkText]}>Virtual Doctor</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialIcons 
              name="account-circle" 
              size={32} 
              color={isDark ? '#4ADE80' : '#059669'} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>AI-Powered Healthcare Assistant</Text>
      </View>

        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, isDark && styles.darkCard]}
              onPress={() => navigation.navigate(feature.screen)}
            >
              {feature.icon}
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>{feature.title}</Text>
              <Text style={[styles.cardDescription, isDark && styles.darkSubtext]}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, isDark && styles.darkSubtext]}>
            ⚠️ This app is for screening purposes only and does not replace professional medical advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  darkContainer: {
    backgroundColor: '#1a1a1a'
  },
  scrollContent: {
    padding: 16
  },  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  profileButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16
  },
  card: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  darkCard: {
    backgroundColor: '#2d2d2d'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#1a1a1a'
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center'
  },
  darkText: {
    color: '#ffffff'
  },
  darkSubtext: {
    color: '#a1a1aa'
  },
  disclaimer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8
  },
  disclaimerText: {
    fontSize: 14,
    color: '#991b1b',
    textAlign: 'center'
  }
});