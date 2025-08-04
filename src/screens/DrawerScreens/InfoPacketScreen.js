// InformationPacketScreen.js

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function InformationPacketScreen() {
  const navigation = useNavigation();

  const sections = [
    {
      key: 'manual',
      title: 'User Manual',
      description:
        "The user's manual, instruction sheet and malfunction instruction sheet can be in electronic form. This is in accordance with federal register titled 'Regulatory Guidance Concerning Electronic Signature and Documents' (76 FR 411)",
      buttonLabel: 'VIEW USER MANUAL',
      onPress: () => {
        /* navigate to PDF viewer or link */
      },
    },
    {
      key: 'instructions',
      title: 'Instructions',
      description:
        "In addition to the above, a supply of blank driver's records of duty status (RODS) graph‑grids sufficient to record the driver's duty status and other related information for a minimum of 8 days must be onboard the commercial motor vehicle (CMV)",
      buttonLabel: 'VIEW INSTRUCTIONS',
      onPress: () => {
        /* navigate to PDF viewer or link */
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {sections.map(({ key, title, description, buttonLabel, onPress }) => (
          <View key={key} style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE = '#0057D9';
const LIGHT_BG = '#F4F8FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
