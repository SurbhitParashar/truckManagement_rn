// src/services/EventBus.js
const listeners = {};

const EventBus = {
  on(event, fn) {
    if (!listeners[event]) listeners[event] = new Set();
    listeners[event].add(fn);
    return () => EventBus.off(event, fn);
  },

  off(event, fn) {
    if (!listeners[event]) return;
    listeners[event].delete(fn);
    if (listeners[event].size === 0) delete listeners[event];
  },

  emit(event, payload) {
    if (!listeners[event]) return;
    for (const fn of Array.from(listeners[event])) {
      try { fn(payload); } catch (e) { console.warn('EventBus handler err', e); }
    }
  }
};

export default EventBus;
