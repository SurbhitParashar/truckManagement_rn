import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>gagan CME-26 | A1</Text>
        <View style={styles.headerIcons}>
          <Icon name="bluetooth-disabled" size={24} color="red" style={{ marginRight: 10 }} />
          <Icon name="notifications-off" size={24} color="red" />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Remaining</Text>
        <Text style={styles.timer}>00:00:00</Text>
        <Text style={styles.status}>SLEEPER</Text>
      </View>

      <Text style={styles.sectionTitle}>Hours of Service</Text>

      <ScrollView style={styles.serviceList}>
        {[
          { label: 'DRIVE', value: '11:00:00', description: '11-Hour Driving Limit' },
          { label: 'Shift', value: '14:00:00', description: '14-Hour On Duty Limit' },
          { label: 'Break', value: '08:00:00', description: '30 Minute Reset Break' },
          { label: 'Cycle', value: '70:00:00', description: 'USA 70/8' },
        ].map((item, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSubtitle}>{item.description}</Text>
            </View>
            <Text style={styles.cardValue}>{item.value}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerLabel: { fontSize: 16, color: '#333' },
  timer: { fontSize: 32, color: 'green', fontWeight: 'bold' },
  status: { fontSize: 16, marginTop: 4, fontWeight: '600' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  serviceList: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSubtitle: { fontSize: 12, color: '#666' },
  cardValue: { fontSize: 16, fontWeight: '600' },
});
