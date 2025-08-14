// src/services/BackgroundService.js
import BackgroundService from 'react-native-background-actions';
import EventBus from './EventBus';

let running = false;
let devInterval = null;

export async function startHosBackground() {
  // avoid double start
  if (running || (BackgroundService && BackgroundService.isRunning && BackgroundService.isRunning())) return;
  running = true;

  const veryLongTask = async () => {
    try {
      // If background service works, use it to emit ticks reliably
      while (BackgroundService.isRunning && BackgroundService.isRunning()) {
        EventBus.emit('tick', Date.now() / 1000);
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e) {
      console.warn('[BackgroundService] background loop error:', e);
    } finally {
      // background stopped — fall back to dev interval if in dev
      if (__DEV__ && !devInterval) {
        devInterval = setInterval(() => {
          EventBus.emit('tick', Date.now() / 1000);
        }, 1000);
        console.log('[BackgroundService] dev fallback interval started');
      }
      running = false;
    }
  };

  const options = {
    taskName: 'HOS Engine',
    taskTitle: 'Hours-of-Service tracking',
    taskDesc: 'Background HOS timers and ELD monitoring',
    // Android: keep as foreground service if needed - add notification config here
    notificationChannelId: 'hos-channel',
  };

  try {
    await BackgroundService.start(veryLongTask, options);
    // If start succeeds we still also install a dev fallback in __DEV__ to be safe while debugging
    if (__DEV__ && !devInterval) {
      devInterval = setInterval(() => {
        EventBus.emit('tick', Date.now() / 1000);
      }, 1000);
      console.log('[BackgroundService] dev fallback interval started (DEV)');
    }
  } catch (err) {
    // If starting background service fails (common on some test devices), use dev fallback
    console.warn('[BackgroundService] start failed, using dev fallback:', err);
    if (!devInterval) {
      devInterval = setInterval(() => {
        EventBus.emit('tick', Date.now() / 1000);
      }, 1000);
      console.log('[BackgroundService] dev fallback interval started (start exception)');
    }
  }
}

export async function stopHosBackground() {
  try {
    if (devInterval) {
      clearInterval(devInterval);
      devInterval = null;
      console.log('[BackgroundService] dev fallback cleared');
    }
    if (BackgroundService && BackgroundService.isRunning && BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  } catch (e) {
    console.warn('[BackgroundService] stop error', e);
  } finally {
    running = false;
  }
}
