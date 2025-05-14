import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

const mockUserData = {
  name: "John Doe",
  age: 28,
  email: "john.doe@example.com",
  consultations: 12,
  lastVisit: "2025-03-20",
  upcomingAppointment: "2025-03-25",
  therapyMinutes: 360,
  moodScore: 8.5,
  streak: 15
};

export default function ProfileScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=profile%20picture%20professional%20looking&seed=123' }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: colors.text }]}>{mockUserData.name}</Text>
          <Text style={[styles.email, { color: colors.text }]}>{mockUserData.email}</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{mockUserData.consultations}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{mockUserData.therapyMinutes}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{mockUserData.streak}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Day Streak</Text>
          </View>
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Appointment</Text>
          <Text style={[styles.appointmentDate, { color: colors.primary }]}>{mockUserData.upcomingAppointment}</Text>
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mood Tracking</Text>
          <View style={styles.moodContainer}>
            <MaterialIcons name="mood" size={24} color={colors.primary} />
            <Text style={[styles.moodScore, { color: colors.text }]}>{mockUserData.moodScore}/10</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    margin: 16,
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoSection: {
    padding: 20,
    margin: 16,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodScore: {
    fontSize: 16,
    fontWeight: '500',
  },
});