// src/services/EldBleService.js
// BLE logic using react-native-ble-plx.
// Emits events via EventBus (identifier, odometer, speed, connected state)

import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import EventBus from './EventBus';
import { ELD_BLE } from '../config/index.js';
import EldBleCache from './EldBleCache';

const manager = new BleManager();
let connectedDevice = null;
let monitorSubs = [];

function decodeUtf8(base64Value) {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Initialize ELD BLE service.
 * @param {Object} [opts={}] - Optional params
 * @param {string} [opts.nameFilter] - Name filter for ELD devices (e.g. 'YOUR_ELD_NAME_OR_PREFIX')
 * @param {string[]} [opts.serviceUUIDs] - Array of service UUIDs to scan for (e.g. ['YOUR_SERVICE_UUID'])
 */
/*******  f22ee011-7482-44dd-bdbc-1ebac7bb3b1e  *******/  try {
    const buffer = Buffer.from(base64Value, 'base64');
    return buffer.toString('utf8');
  } catch (e) {
    return null;
  }
}

export async function startEldBle() {
  manager.startDeviceScan([ELD_BLE.SERVICE_UUID], null, async (err, device) => {
    if (err) {
      console.warn('BLE scan error', err);
      return;
    }
    if (!device) return;

    const name = (device.name || '').toLowerCase();
    if (ELD_BLE.DEVICE_NAME && name.includes(ELD_BLE.DEVICE_NAME.toLowerCase())) {
      manager.stopDeviceScan();
      try {
        connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();

        // 🔹 ELD Identifier (serial number)
        try {
          const read = await connectedDevice.readCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_ELD_IDENTIFIER
          );
          const identified = decodeUtf8(read.value);
          if (identified) {
            EldBleCache.setIdentifier(identified);   // <-- add
            EventBus.emit('eld:identifier', identified);
          }
        } catch (e) {
          console.warn('ELD identifier read failed', e);
        }

        // 🔹 Odometer (read once + subscribe)
        try {
          const odChar = await connectedDevice.readCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_ODOMETER
          );
          const odText = decodeUtf8(odChar.value);
          const odo = Number(odText);
          if (!isNaN(odo)) {
            EldBleCache.setOdometer(odo);           // <-- add
            EventBus.emit('eld:odometer', odo);
          }
        } catch (e) {
          console.warn('odometer read failed', e);
        }

        try {
          const sub = connectedDevice.monitorCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_ODOMETER,
            (error, characteristic) => {
              if (error) {
                console.warn('odometer monitor error', error);
                return;
              }
              const odText = decodeUtf8(characteristic.value);
              const odo = Number(odText);
              if (!isNaN(odo)) {
                EldBleCache.setOdometer(odo);           // <-- add
                EventBus.emit('eld:odometer', odo);
              }
            }
          );
          monitorSubs.push(sub);
        } catch (e) {
          console.warn('odometer monitor failed', e);
        }

        
        // 🔹 Engine Hours (read once + subscribe)
        try {
          const engChar = await connectedDevice.readCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_ENGINE_HOURS    // <-- make sure this exists in config/index.js
          );
          const engText = decodeUtf8(engChar.value);
          const hours = Number(engText);
          if (!isNaN(hours)) {
            EldBleCache.setEngineHours(hours);     // <-- save to cache
            EventBus.emit('eld:engineHours', hours);
          }
        } catch (e) {
          console.warn('engine hours read failed', e);
        }

        try {
          const sub3 = connectedDevice.monitorCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_ENGINE_HOURS,  // <-- from config
            (error, characteristic) => {
              if (error) {
                console.warn('engine hours monitor error', error);
                return;
              }
              const engText = decodeUtf8(characteristic.value);
              const hours = Number(engText);
              if (!isNaN(hours)) {
                EldBleCache.setEngineHours(hours);  // <-- update cache
                EventBus.emit('eld:engineHours', hours);
              }
            }
          );
          monitorSubs.push(sub3);
        } catch (e) {
          console.warn('engine hours monitor failed', e);
        }

        // 🔹 Speed (continuous subscription)
        try {
          const sub2 = connectedDevice.monitorCharacteristicForService(
            ELD_BLE.SERVICE_UUID,
            ELD_BLE.CHAR_SPEED,
            (error, characteristic) => {
              if (error) return;
              const speedText = decodeUtf8(characteristic.value);
              const speed = Number(speedText);
              if (!isNaN(speed)) {
                EldBleCache.setSpeed(speed);            // <-- add
                EventBus.emit('speed', speed);
              }
            }
          );
          monitorSubs.push(sub2);
        } catch (e) {
          console.warn('speed monitor failed', e);
        }

        EventBus.emit('eld:connected', { id: device.id, name: device.name });
      } catch (e) {
        console.warn('Failed to connect to ELD', e);
      }
    }
  });
}

export async function stopEldBle() {
  try {
    manager.stopDeviceScan();
    if (connectedDevice) {
      for (const sub of monitorSubs) {
        try {
          sub.remove();
        } catch { }
      }
      monitorSubs = [];
      await connectedDevice.cancelConnection();
      connectedDevice = null;
      EventBus.emit('eld:disconnected');
    }
  } catch (e) {
    console.warn('stopEldBle error', e);
  }
}
