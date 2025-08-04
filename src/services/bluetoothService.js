import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export async function enableBluetooth() {
  if (Platform.OS === 'android') {
    const perms = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (
      perms[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
      perms[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
      perms[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      throw new Error('Required Bluetooth/Location permissions denied');
    }
  }

  const state = await manager.state();
  if (state !== 'PoweredOn') {
    throw new Error('Bluetooth is off. Please enable it in system settings.');
  }
  return true;
}


export async function connectToEld(mac) {
  return new Promise((resolve, reject) => {
    let found = false;

    // Start scanning
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Stop scan on error
        manager.stopDeviceScan();
        reject(error);
        return;
      }

      // Match by MAC (device.id)
      if (device.id.toLowerCase() === mac.toLowerCase()) {
        found = true;
        manager.stopDeviceScan();

        device
          .connect()
          .then(d => d.discoverAllServicesAndCharacteristics())
          .then(() => resolve(device))
          .catch(connectErr => reject(connectErr));
      }
    });

    // Timeout: stop scan after 10s if not found
    setTimeout(() => {
      if (!found) {
        manager.stopDeviceScan();
        reject(new Error('ELD not found'));
      }
    }, 10000);
  });
}
