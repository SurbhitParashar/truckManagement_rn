// src/services/LogSyncService.js
export async function syncLogToServer(dateKey, logData) {
  try {
    await fetch('https://your-backend.com/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateKey,
        driverId: 'YOUR_DRIVER_ID',
        ...logData
      })
    });
    console.log(`Log for ${dateKey} synced`);
  } catch (err) {
    console.error('Log sync failed', err);
  }
}
