// src/services/ELDService.js - basically it take data one of the eld connection setup
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { ELD_BLE } from '../config/index.js';

class ELDService {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
  }

  // Scan & connect to ELD by name
  async connectToELD() {
    return new Promise((resolve, reject) => {
      console.log('🔍 Scanning for ELD...');

      const subscription = this.manager.onStateChange(async (state) => {
        if (state === 'PoweredOn') {
          this.manager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
              console.error('❌ Scan error:', error);
              subscription.remove();
              reject(error);
              return;
            }

            if (device.name === ELD_BLE.DEVICE_NAME) {
              console.log('✅ Found ELD device:', device.name);
              this.manager.stopDeviceScan();

              try {
                this.device = await device.connect();
                await this.device.discoverAllServicesAndCharacteristics();
                console.log('🔗 Connected to ELD:', this.device.id);
                subscription.remove();
                resolve(this.device);
              } catch (err) {
                console.error('❌ Connection failed:', err);
                reject(err);
              }
            }
          });
        }
      }, true);
    });
  }

  async readCharacteristic(serviceUUID, charUUID) {
    if (!this.device) throw new Error('Device not connected');
    const char = await this.device.readCharacteristicForService(serviceUUID, charUUID);
    return this._decodeValue(char.value);
  }

  async getELDIdentifier() {
    return this.readCharacteristic(ELD_BLE.SERVICE_UUID, ELD_BLE.CHAR_ELD_IDENTIFIER);
  }

  async getOdometer() {
    return this.readCharacteristic(ELD_BLE.SERVICE_UUID, ELD_BLE.CHAR_ODOMETER);
  }

  async getSpeed() {
    return this.readCharacteristic(ELD_BLE.SERVICE_UUID, ELD_BLE.CHAR_SPEED);
  }

  async getEngineHours() {
    return this.readCharacteristic(ELD_BLE.SERVICE_UUID, ELD_BLE.CHAR_ENGINE_HOURS);
  }

  _decodeValue(base64Str) {
    if (!base64Str) return null;
    const raw = Buffer.from(base64Str, 'base64').toString('utf8');
    return raw.trim();
  }

  async disconnect() {
    if (this.device) {
      await this.manager.cancelDeviceConnection(this.device.id);
      console.log('🔌 Disconnected from ELD');
      this.device = null;
    }
  }
}

export default new ELDService();
