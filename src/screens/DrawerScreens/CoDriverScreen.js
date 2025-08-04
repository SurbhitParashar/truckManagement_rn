import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CoDriverScreen() {
  const [selectedDriver, setSelectedDriver] = useState('');

  const drivers = ['John Doe', 'Emily Smith', 'Michael Brown', 'check check'];

  const handleSwitch = () => {
    if (selectedDriver) {
      Alert.alert('Success', `CoDriver updated: ${selectedDriver}`);
    } else {
      Alert.alert('Error', 'Please select a co-driver');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Text style={styles.title}>Co-Driver</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Co Driver</Text>
        <Text style={styles.subLabel}>Select Your Co-Driver</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedDriver}
            onValueChange={(itemValue) => setSelectedDriver(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select --" value="" />
            {drivers.map((driver, index) => (
              <Picker.Item key={index} label={driver} value={driver} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.switchSection}>
        <Text style={styles.switchTitle}>Switch Drivers</Text>
        <Text style={styles.switchInfo}>
          You will become co-driver. Your co-driver will stay driver
        </Text>
      </View>

      <TouchableOpacity style={styles.switchBtn} onPress={handleSwitch}>
        <Text style={styles.switchText}>SWITCH</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#007AFF',
  },
  switchSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  switchInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  switchBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  switchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
