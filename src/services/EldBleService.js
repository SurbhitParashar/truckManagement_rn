// src/services/EldBleService.js
import { BleManager } from 'react-native-ble-plx';
import EventBus from './EventBus';

// Named exports so your import { initEldBle } works.
const manager = new BleManager();
let isScanning = false;
let connectedDeviceIds = new Set();
let stateSubscription = null;

const SERVICE_UUID = 'YOUR_SERVICE_UUID'.toLowerCase(); // <-- REPLACE
const SPEED_CHAR_UUID = 'YOUR_SPEED_CHAR_UUID'.toLowerCase(); // <-- REPLACE
const DEVICE_NAME_FILTER = 'YOUR_ELD_NAME_OR_PREFIX'; // optional

export function initEldBle(opts = {}) {
  // allow overrides via opts
  const nameFilter = opts.nameFilter ?? DEVICE_NAME_FILTER;
  const serviceUUIDs = opts.serviceUUIDs ?? (SERVICE_UUID ? [SERVICE_UUID] : null);

  if (isScanning) return;
  isScanning = true;

  // Listen for adapter state
  stateSubscription = manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      startScanning({ nameFilter, serviceUUIDs });
    } else {
      // adapter off: stop scanning
      try { manager.stopDeviceScan(); } catch (e) {}
    }
  }, true);
}

function startScanning({ nameFilter, serviceUUIDs }) {
  try {
    manager.startDeviceScan(serviceUUIDs || null, null, async (error, device) => {
      if (error) {
        console.warn('ELD BLE scan error:', error);
        return;
      }
      if (!device) return;

      // optional: filter by device name or localName
      if (nameFilter && device.name && !device.name.includes(nameFilter) && !(device.localName && device.localName.includes(nameFilter))) {
        return;
      }

      // Avoid connecting repeatedly
      if (connectedDeviceIds.has(device.id)) return;

      try {
        // connect
        const d = await device.connect();
        connectedDeviceIds.add(d.id);

        // discover services/characteristics
        await d.discoverAllServicesAndCharacteristics();

        // Subscribe to the characteristic for speed (if the device supports notify)
        // Make sure these UUIDs match your ELD vendor's documentation.
        d.monitorCharacteristicForService(
          SERVICE_UUID,
          SPEED_CHAR_UUID,
          (err, char) => {
            if (err) {
              console.warn('ELD char monitor error', err);
              return;
            }
            if (!char || !char.value) return;

            try {
              const speed = parseBase64ToNumber(char.value);
              // speed expected in mph — convert if needed (kph->mph)
              EventBus.emit('speed', speed);
            } catch (ex) {
              console.warn('Failed to parse ELD char value', ex);
            }
          }
        );
      } catch (connErr) {
        console.warn('ELD connect error', connErr);
        // don't block; continue scanning
      }
    });
  } catch (e) {
    console.warn('startDeviceScan failed', e);
  }
}

// Utility to decode base64 -> number. Adapt to your ELD payload.
function parseBase64ToNumber(b64) {
  // Try global atob (if available) or Buffer fallback
  let raw = null;
  try {
    if (typeof atob === 'function') {
      raw = atob(b64);
    } else {
      // Buffer fallback: ensure you have 'buffer' polyfill if required
      // In many RN setups Buffer is available globally; if not, install 'buffer' and import.
      // const { Buffer } = require('buffer');
      raw = Buffer.from(b64, 'base64').toString('utf8');
    }
  } catch (e) {
    // As a last resort try simple base64 decode helper
    throw new Error('Base64 decode failed: ' + e.message);
  }

  // Now raw contains bytes/ASCII. Your ELD's payload format decides how to parse.
  // Common possibilities:
  //  - raw string "12.4" -> parseFloat
  //  - binary little-endian uint16 -> read bytes
  // Implement the simplest default: numeric string
  const n = parseFloat(raw);
  if (Number.isNaN(n)) {
    // If not numeric, try reading first byte as uint value:
    const charCode = raw.charCodeAt(0);
    if (Number.isFinite(charCode)) return charCode;
    throw new Error('Unable to parse numeric speed from payload: ' + raw);
  }
  return n;
}

export async function stopEldBle() {
  try {
    manager.stopDeviceScan();
    for (const id of Array.from(connectedDeviceIds)) {
      try {
        const d = await manager.devices([id]);
        if (d && d[0]) {
          await d[0].cancelConnection();
        }
      } catch (e) {
        // ignore disconnect errors
      }
    }
    connectedDeviceIds.clear();
    if (stateSubscription) {
      stateSubscription.remove();
      stateSubscription = null;
    }
  } catch (e) {
    console.warn('stopEldBle error', e);
  } finally {
    isScanning = false;
  }
}
