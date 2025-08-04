import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

export default function RulesScreen() {
  const [shortHaul, setShortHaul] = useState(false);

  const rules = [
    { title: 'Cycle Rule', value: 'USA 70 hours / 8 days' },
    { title: 'Cargo Type', value: 'Property' },
    { title: 'Restart', value: '34 Hours Restart' },
    { title: 'Rest Break', value: '30 Minutes Rest Break Required' },
  ];

  const permissions = [
    { title: 'Personal Conveyance', value: 'Allowed' },
    { title: 'Yard Moves', value: 'Allowed' },
    { title: 'Unlimited Trailers', value: 'Forbidden' },
    { title: 'Unlimited Shipping Documents', value: 'Forbidden' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Rules</Text>

        {/* Rules Section */}
        {rules.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}

        {/* 16-Hour Switch */}
        <View style={styles.row}>
          <Text style={styles.label}>16-Hour Short-Haul Exception</Text>
          <Switch
            value={shortHaul}
            onValueChange={setShortHaul}
            thumbColor={shortHaul ? '#007AFF' : '#ccc'}
            trackColor={{ false: '#ccc', true: '#A3D4FF' }}
          />
        </View>

        {/* Permissions Section */}
        {permissions.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Please contact your fleet manager to change rules or to add exceptions
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    marginTop: 15,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
