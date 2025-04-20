import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EldConnectScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={styles.header}>
        <Icon name="swap-horiz" size={24} color="#000" />
        <Text style={styles.headerTitle}>A1</Text>
        <Icon name="bluetooth-disabled" size={24} color="red" />
        <Icon name="notifications-off" size={24} color="red" style={{ marginLeft: 10 }} />
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

      <Text style={styles.inputLabel}>Enter ELD MAC address listed on the device</Text>
      <TextInput style={styles.input} placeholder="0271" keyboardType="default" />

      <TouchableOpacity style={styles.connectBtn}>
        <Text style={styles.connectText}>CONNECT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.disconnectBtn}
      onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.disconnectText}>CONTINUE DISCONNECTED</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  banner: {
    backgroundColor: '#cce5ff',
    padding: 10,
    marginVertical: 15,
    borderRadius: 5,
  },
  bannerText: {
    color: '#004085',
    fontWeight: 'bold',
  },
  verifyBox: {
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  bullet: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  input: {
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    color: '#000',
  },
  connectBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  connectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disconnectBtn: {
    borderColor: '#007bff',
    borderWidth: 1,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  disconnectText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default EldConnectScreen;
