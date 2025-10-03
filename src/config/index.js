// src/config/index.js
// Place FMCSA static and ELD specific constants here.

/**
 * ELD registration ID (issued when ELD model is registered with FMCSA).
 * Example: 'N87C' - a single constant per ELD model.
 */
export const ELD_REGISTRATION_ID = 'REPLACE_WITH_YOUR_ELD_MODEL_REG_ID';

/**
 * BLE service & characteristic UUIDs used by your ELD.
 * You MUST replace these with the real UUIDs from the ELD vendor.
 */
export const ELD_BLE = {
  SERVICE_UUID: '00001234-0000-1000-8000-00805f9b34fb',         // placeholder service UUID
  CHAR_ELD_IDENTIFIER: '00002a25-0000-1000-8000-00805f9b34fb', // Standard GATT (Device Serial Number)
  CHAR_ODOMETER: '00002a2c-0000-1000-8000-00805f9b34fb',       // placeholder (vendor-specific)
  CHAR_SPEED: '00002a63-0000-1000-8000-00805f9b34fb',          // placeholder (vendor-specific)
  CHAR_ENGINE_HOURS: '00002a77-0000-1000-8000-00805f9b34fb',   // placeholder (vendor-specific)
  DEVICE_NAME: 'YOUR_ELD_DEVICE_NAME',                       // device advertised name

};
