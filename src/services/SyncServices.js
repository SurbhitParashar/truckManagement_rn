// src/services/SyncService.js
import {
  getUnsyncedEvents,
  markEventsSynced,
  getUnsyncedForms,
  markFormsSynced,
  getUnsyncedCerts,
  markCertsSynced
} from './LogManager';
import { syncLogsApi, submitFormApi, certifyLogApi } from '../api/logsApi';

let intervalId = null;
let syncing = false;

// Simple internet check using fetch()
async function hasInternet() {
  try {
    const response = await fetch("https://www.google.com", { method: "HEAD" });
    return response.ok;
  } catch (e) {
    return false;
  }
}

export function startLogSync({ getDriverUsername }) {
  console.log("🚀 startLogSync called");

  stopLogSync();

  // Check every 5 seconds (tweak as needed)
  intervalId = setInterval(async () => {
    if (await hasInternet()) {
      try {
        await syncNow(getDriverUsername);
      } catch (e) {
        console.warn("Sync attempt failed", e?.message || e);
      }
    }
  }, 5000);
}

export function stopLogSync() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export async function syncNow(getDriverUsername) {
  console.log("🔔 syncNow called");

  if (syncing) return;
  syncing = true;
  try {
    const driverUsername = getDriverUsername();
    if (!driverUsername) return;
    const driverId = driverUsername; // local key uses username

    // 1) sync events
    const unsynced = await getUnsyncedEvents(driverId);
    if (unsynced.length) {
      console.log("📤 Syncing events count=", unsynced);
      const payload = { driverUsername, events: unsynced };
      const result = await syncLogsApi(payload);
      console.log("📤 Syncing logs payload:", {
        driverUsername,
        unsynced
      });

      const saved = result?.savedClientEventIds || [];
      if (saved.length) await markEventsSynced(driverId, saved);
    }

    // 2) sync forms
    const unsyncedForms = await getUnsyncedForms(driverId);
    if (unsyncedForms.length) {
      console.log("📤 Syncing forms count=", unsyncedForms.length);
      const savedDates = [];
      for (const f of unsyncedForms) {
        try {
          await submitFormApi({
            driverUsername,
            logDate: f.logDate,
            formData: f.metadata,
          });
          savedDates.push(f.logDate);
        } catch (e) {
          console.warn("Form sync failed for", f.logDate, e?.message || e);
        }
      }
      if (savedDates.length) await markFormsSynced(driverId, savedDates);
    }

    // 3) sync certs
    const unsyncedCerts = await getUnsyncedCerts(driverId);
    if (unsyncedCerts.length) {
      console.log("📤 Syncing certs count=", unsyncedCerts.length);
      const savedDates = [];
      for (const c of unsyncedCerts) {
        try {
          await certifyLogApi({
            driverUsername,
            logDate: c.logDate,
            signature: c.cert.signature,
            certifierName: c.cert.certifier,
          });
          savedDates.push(c.logDate);
        } catch (e) {
          console.warn("Cert sync failed for", c.logDate, e?.message || e);
        }
        console.log('📤 Sending forms payload:', JSON.stringify({ driverUsername, logDate: f.logDate, formData: f.metadata }, null, 2));

      }
      if (savedDates.length) await markCertsSynced(driverId, savedDates);
    }
  } finally {
    syncing = false;
  }
}
