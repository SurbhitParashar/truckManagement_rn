// src/screens/EldConnectScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { enableBluetooth } from '../services/bluetoothService';
import { enableLocation } from '../services/locationService';
import ELDService from '../services/ELDService';
import { ELD_REGISTRATION_ID } from '../config';
import { useEld } from '../context/EldContext';


const EldConnectScreen = ({ navigation }) => {
  const [mac, setMac] = useState('');
  const [btEnabled, setBtEnabled] = useState(false);
  const [locEnabled, setLocEnabled] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Telemetry values
  // const [identifier, setIdentifier] = useState(null);
  // const [odometer, setOdometer] = useState(null);
  // const [speed, setSpeed] = useState(null);
  // const [engineHours, setEngineHours] = useState(null);

  const { eldData } = useEld();


  const handleToggleBluetooth = async () => {
    try {
      const enabled = await enableBluetooth();
      setBtEnabled(enabled);
    } catch (e) {
      Alert.alert('Bluetooth Error', e.message);
    }
  };

  const handleToggleLocation = async () => {
    try {
      const enabled = await enableLocation();
      setLocEnabled(enabled);
    } catch (e) {
      Alert.alert('Location Error', e.message);
    }
  };

  const handleConnect = async () => {
    if (!btEnabled || !locEnabled) {
      Alert.alert('Warning', 'Please enable Bluetooth and Location first.');
      return;
    }
    if (!mac.trim()) {
      Alert.alert('Error', 'Please enter a valid MAC address.');
      return;
    }
    try {
      setConnecting(true);

      // BLE connection — all data will come via EventBus and context
      await ELDService.connectToELD(mac.trim());
      Alert.alert('Connected', 'Connected to ELD. Telemetry will update shortly.');


    } catch (e) {
      Alert.alert('Connection Failed', e.message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={styles.header}>
        <Icon name="swap-horiz" size={24} color="#000" />
        <Text style={styles.headerTitle}>A1</Text>

        <TouchableOpacity onPress={handleToggleBluetooth}>
          <Icon
            name={btEnabled ? 'bluetooth' : 'bluetooth-disabled'}
            size={24}
            color={btEnabled ? 'green' : 'red'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleLocation} style={{ marginLeft: 10 }}>
          <Icon
            name={locEnabled ? 'location-on' : 'location-off'}
            size={24}
            color={locEnabled ? 'green' : 'red'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Unable to connect to ELD with MAC</Text>
      </View>

      <View style={styles.verifyBox}>
        <Text style={styles.instructions}>Please verify the following items:</Text>
        <Text style={styles.bullet}>• ELD MAC address is entered correctly</Text>
        <Text style={styles.bullet}>• ELD hardware is properly installed</Text>
        <Text style={styles.bullet}>• Vehicle Power is on</Text>
        <Text style={styles.bullet}>• Bluetooth is enabled on mobile device</Text>
        <Text style={styles.bullet}>• GPS is enabled on mobile device</Text>
      </View>

      <Text style={styles.inputLabel}>
        Enter ELD MAC address listed on the device
      </Text>
      <TextInput
        style={styles.input}
        placeholder="0271"
        keyboardType="default"
        value={mac}
        onChangeText={setMac}
      />

      <TouchableOpacity
        style={styles.connectBtn}
        onPress={handleConnect}
        disabled={connecting}
      >
        <Text style={styles.connectText}>
          {connecting ? 'CONNECTING...' : 'CONNECT'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.disconnectBtn}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.disconnectText}>CONTINUE DISCONNECTED</Text>
      </TouchableOpacity>

      {/* --- ELD Data Display --- */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>FMCSA Registration ID:</Text>
        <Text style={styles.value}>{ELD_REGISTRATION_ID}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>ELD Identifier (Serial):</Text>
        <Text style={styles.value}>{eldData.identifier || '-'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Odometer:</Text>
        <Text style={styles.value}>{eldData.odometer || '-'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Speed:</Text>
        <Text style={styles.value}>{eldData.speed || '-'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Engine Hours:</Text>
        <Text style={styles.value}>{eldData.engineHours || '-'}</Text>
      </View>
    </ScrollView>
  );
};

export default EldConnectScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  banner: { backgroundColor: '#cce5ff', padding: 10, marginVertical: 15, borderRadius: 5 },
  bannerText: { color: '#004085', fontWeight: 'bold' },
  verifyBox: { marginBottom: 20 },
  instructions: { fontSize: 16, marginBottom: 8, color: '#333' },
  bullet: { fontSize: 14, color: '#555', marginLeft: 10, marginBottom: 2 },
  inputLabel: { fontSize: 14, color: '#000', marginBottom: 6 },
  input: { borderColor: '#007bff', borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 20, color: '#000' },
  connectBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 10 },
  connectText: { color: '#fff', fontWeight: 'bold' },
  disconnectBtn: { borderColor: '#007bff', borderWidth: 1, padding: 15, borderRadius: 30, alignItems: 'center' },
  disconnectText: { color: '#007bff', fontWeight: 'bold' },
  infoBox: { marginVertical: 10 },
  label: { fontWeight: 'bold' },
  value: { color: '#007AFF', marginTop: 4 },
});
