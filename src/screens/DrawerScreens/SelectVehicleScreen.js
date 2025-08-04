import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const sampleVehicles = [
  { id: '20', year: '2024', make: 'Volvo', vin: '4V4NC9EH3RN638280' },
  { id: '59', year: '2020', make: 'VOLVO', vin: '4V4NC9EH3RN637850' },
  { id: '123', year: '2020', make: 'Freightliner', vin: '4V4NC9EH3RN638280' },
  { id: '1313', year: '2016', make: 'Freightliner', vin: '3AKJGLDR2GSGW7588' },
  { id: '345', year: '4567', make: '546', vin: '4V4NC9EH3RN638280' },
  { id: '55', year: '2019', make: 'VOLVO', vin: '4V4NC9EH6KN200097' },
  { id: '35', year: '2019', make: 'VOLVO', vin: '4V4NC9EH3LN258668' },
  { id: 'test12', year: '2021', make: 'test', vin: 'A1B2C3D4E5F6G7H8I' },
  { id: 'test1313', year: '2021', make: 'VOLVO', vin: '1XPBD49X2PD857216' },
  { id: 'A1', year: '2021', make: 'VOLVO', vin: '1GNDS13S382132112' },
];

export default function VehicleSelectScreen() {
  const renderVehicle = ({ item }) => (
    <TouchableOpacity style={styles.vehicleCard}>
      <Text style={styles.vehicleTitle}>{item.id}</Text>
      <Text style={styles.vehicleText}>
        {item.year}  {item.make}
      </Text>
      <Text style={styles.vehicleVin}>{item.vin}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.header}>Select Vehicle</Text>
      <FlatList
        data={sampleVehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicle}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  vehicleCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  vehicleText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  vehicleVin: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
