// src/api/logsApi.js
import client from './client';

// Sync events (POST /api/app/logs/sync)
export async function syncLogsApi(payload) {
  // console.log("payload",payload)
  const resp = await client.post('/app/logs/sync', payload);
  return resp.data;
}

// Submit form metadata
export async function submitFormApi(payload) {
  const resp = await client.post('/app/logs/form', payload);
  return resp.data;
}

// Certify log
export async function certifyLogApi(payload) {
  const resp = await client.post('/app/logs/certify', payload);
  return resp.data;
}

// Fetch logs (used by app and portal)
export async function fetchLogsApi(username, days = 7) {
  const resp = await client.get(`/app/logs/${encodeURIComponent(username)}?days=${days}`);
  return resp.data;
}
