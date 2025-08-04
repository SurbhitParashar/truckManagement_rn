import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BLUE = '#0057D9';
const LIGHT_BG = '#F4F8FF';

const ActionCard = ({ title, subtitle, buttonLabel, onPress, icon }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      {icon && <Ionicons name={icon} size={24} color={BLUE} style={styles.cardIcon} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
    <TouchableOpacity style={styles.cardButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  </View>
);

export default function DotInspectionScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>DOT Inspection</Text>

        <ActionCard
          icon="clipboard-outline"
          title="Inspect Logs for 24 hours period and previous days for one HOS cycle"
          subtitle="Select 'Start Inspection' and give your device to officer"
          buttonLabel="START INSPECTION"
          onPress={() => navigation.navigate('Logs')}
        />

        <ActionCard
          icon="send-outline"
          title="Send Logs for 24 hours period and previous days for one HOS cycle"
          subtitle="Send your logs to officer if they request"
          buttonLabel="SEND LOGS"
          onPress={() => {/* send logic */}}
        />

        <ActionCard
          icon="mail-outline"
          title="Email Logs for 24 hours period and previous days for one HOS cycle"
          subtitle="Email your logs in PDF format"
          buttonLabel="EMAIL LOGS"
          onPress={() => {/* email logic */}}
        />

        <ActionCard
          icon="information-circle-outline"
          title="My LOGS certify that the app use complies with all requirements for ELD as defined in Federal Motor Carrier Safety regulation 49 CFR part 395 Subpart B"
          buttonLabel="INFORMATION PACKET"
          onPress={() => navigation.navigate('InformationPacket')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: BLUE,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    // Android elevation
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002C5F',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A6FA1',
    lineHeight: 20,
  },
  cardButton: {
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
