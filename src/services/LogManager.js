// src/services/LogManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableLocation } from './locationService';
import EldBleCache from './EldBleCache';
import { v4 as uuidv4 } from 'uuid'; // optionally; or use custom generator

// Local storage key template
const KEY_PREFIX = 'HOS_LOGS_'; // HOS_LOGS_${driverId}

function makeClientEventId() {
  // simple fallback generator if uuid not available
  return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
}

/**
 * Save status change into local AsyncStorage (day bucket)
 * Also attaches clientEventId, synced flag, last known ELD values.
 */
export async function saveStatusChange(driverId, newStatus) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const now = new Date();
  const isoDate = now.toISOString().split('T')[0];

  // last known ELD values from cache
  const eldIdentifier = EldBleCache.getLastId();
  const odometer = EldBleCache.getLastOdometer();
  const engineHours = EldBleCache.getLastEngineHours();

  // fetch location (best effort)
  let locationData = null;
  try {
    locationData = await enableLocation();
  } catch (err) {
    // ignore location failures
    console.warn('Location fetch failed:', err?.message || err);
  }

  // load logs
  let logs = [];
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    logs = json ? JSON.parse(json) : [];
  } catch (e) {
    logs = [];
  }

  // find/create today's bucket
  let dayLog = logs.find(l => l.date === isoDate);
  if (!dayLog) {
    dayLog = { date: isoDate, events: [], metadata: null, cert: null };
    logs.push(dayLog);
  }

  const clientEventId = (typeof uuidv4 === 'function' ? uuidv4() : makeClientEventId());

  // push event
  dayLog.events.push({
    id: clientEventId,     // local id
    clientEventId,
    status: newStatus,
    time: now.toISOString(),
    location: locationData,
    eldIdentifier: eldIdentifier || null,
    odometer: typeof odometer === 'number' ? odometer : null,
    engineHours: typeof engineHours === 'number' ? engineHours : null,
    synced: false          // mark for sync
  });

  // prune to last 7 days and save
  logs = logs
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

  // debug
  console.log('📥 Saved status change locally:', { driverId, date: isoDate, clientEventId });
  return clientEventId;
}

/**
 * Get all logs (last 7 days)
 */
export async function getLogs(driverId) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

/**
 * Return an array of unsynced events with metadata attached
 * Format: { id, clientEventId, status, time, logDate, location, odometer, engineHours, eldIdentifier }
 */
export async function getUnsyncedEvents(driverId) {
  const logs = await getLogs(driverId);
  const out = [];
  for (const day of logs) {
    for (const ev of day.events || []) {
      if (!ev.synced) {
        out.push({
          id: ev.id,
          clientEventId: ev.clientEventId || ev.id,
          status: ev.status,
          time: ev.time,
          logDate: day.date,
          location: ev.location || null,
          eldIdentifier: ev.eldIdentifier || null,
          odometer: typeof ev.odometer === 'number' ? ev.odometer : null,
          engineHours: typeof ev.engineHours === 'number' ? ev.engineHours : null
        });
      }
    }
  }
  return out;
}

/**
 * Mark a set of clientEventIds as synced locally
 */
export async function markEventsSynced(driverId, clientEventIds = []) {
  if (!clientEventIds || !clientEventIds.length) return;
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  const logs = json ? JSON.parse(json) : [];
  for (const day of logs) {
    for (const ev of day.events || []) {
      if (clientEventIds.includes(ev.clientEventId)) {
        ev.synced = true;
      }
    }
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log('✅ Marked events synced:', clientEventIds.length);
}

/**
 * Save the form metadata locally on a given day
 * - sets dayLog.metadata = formData
 * - sets dayLog.metadataSynced = false
 */
export async function saveFormForDate(driverId, logDate, formData) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  const logs = json ? JSON.parse(json) : [];
  let dayLog = logs.find(l => l.date === logDate);
  if (!dayLog) {
    dayLog = { date: logDate, events: [], metadata: null, cert: null };
    logs.push(dayLog);
  }
  dayLog.metadata = formData;
  dayLog.metadataSynced = false;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log('💾 Saved form for', logDate);
}

/**
 * Get unsynced forms (array of { logDate, metadata })
 */
export async function getUnsyncedForms(driverId) {
  const logs = await getLogs(driverId);
  const out = [];
  for (const day of logs) {
    if (day.metadata && day.metadataSynced !== true) {
      out.push({ logDate: day.date, metadata: day.metadata });
    }
  }
  return out;
}

/**
 * mark forms synced locally
 */
export async function markFormsSynced(driverId, logDates = []) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  const logs = json ? JSON.parse(json) : [];
  for (const day of logs) {
    if (logDates.includes(day.date) && day.metadata) {
      day.metadataSynced = true;
    }
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log('✅ Marked forms synced:', logDates);
}

/**
 * Save certification locally (signatureBase64, certifier)
 * sets dayLog.cert = { signature, certifier, time, synced:false }
 */
export async function certifyLocalLog(driverId, logDate, signatureBase64, certifierName = null) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  const logs = json ? JSON.parse(json) : [];
  let dayLog = logs.find(l => l.date === logDate);
  if (!dayLog) {
    dayLog = { date: logDate, events: [], metadata: null, cert: null };
    logs.push(dayLog);
  }
  dayLog.cert = {
    signature: signatureBase64,
    certifier: certifierName,
    time: new Date().toISOString(),
    synced: false
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log('🔏 Cert saved locally for', logDate);
}

/**
 * Get unsynced certs
 */
export async function getUnsyncedCerts(driverId) {
  const logs = await getLogs(driverId);
  return logs.filter(l => l.cert && l.cert.synced !== true).map(l => ({
    logDate: l.date,
    cert: l.cert
  }));
}

/**
 * mark certs synced
 */
export async function markCertsSynced(driverId, logDates = []) {
  const STORAGE_KEY = `${KEY_PREFIX}${driverId}`;
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  const logs = json ? JSON.parse(json) : [];
  for (const day of logs) {
    if (logDates.includes(day.date) && day.cert) {
      day.cert.synced = true;
    }
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log('✅ Marked certs synced:', logDates);
}
