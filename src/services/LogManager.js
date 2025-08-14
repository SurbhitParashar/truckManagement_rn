// src/services/LogManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableLocation } from './locationService'; // <-- import your existing fn

export async function saveStatusChange(driverId, newStatus) {
  const STORAGE_KEY = `HOS_LOGS_${driverId}`;
  const now = new Date();
  const isoDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

  // Get location using your existing function
  let locationData = null;
  try {
    locationData = await enableLocation();
  } catch (err) {
    console.warn("Location fetch failed", err);
  }

  // Load existing logs
  let logs = [];
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    logs = json ? JSON.parse(json) : [];
  } catch {
    logs = [];
  }

  // Find today's log
  let dayLog = logs.find(l => l.date === isoDate);
  if (!dayLog) {
    dayLog = { date: isoDate, events: [] };
    logs.push(dayLog);
  }

  // Add new event
  dayLog.events.push({
    status: newStatus,
    time: now.toISOString(),
    location: locationData // will include lat, lng, city, state
  });

  // Keep only last 7 days
  logs = logs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
