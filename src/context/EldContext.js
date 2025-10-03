// src/context/EldContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import EventBus from '../services/EventBus';
import { startEldBle, stopEldBle } from '../services/EldBleService';

const EldContext = createContext();

export function EldProvider({ children }) {
  const [eldData, setEldData] = useState({
    connected: false,
    identifier: null,
    odometer: null,
    speed: null,
    engineHours: null,    // <-- add this
  });


  useEffect(() => {
    // listen to events from BLE service
    const unsubId = EventBus.on('eld:identifier', (val) =>
      setEldData((prev) => ({ ...prev, identifier: val }))
    );
    const unsubOdo = EventBus.on('eld:odometer', (val) =>
      setEldData((prev) => ({ ...prev, odometer: val }))
    );
    const unsubSpeed = EventBus.on('speed', (val) =>
      setEldData((prev) => ({ ...prev, speed: val }))
    );
    const unsubConn = EventBus.on('eld:connected', () =>
      setEldData((prev) => ({ ...prev, connected: true }))
    );
    const unsubDisc = EventBus.on('eld:disconnected', () =>
      setEldData((prev) => ({ ...prev, connected: false }))
    );
    const unsubEng = EventBus.on('eld:engineHours', (val) =>
      setEldData((prev) => ({ ...prev, engineHours: val }))
    );


    // start scanning automatically when app starts
    startEldBle();

    return () => {
      // cleanup
      unsubId();
      unsubOdo();
      unsubSpeed();
      unsubConn();
      unsubDisc();
      stopEldBle();
      unsubEng();

    };
  }, []);

  return (
    <EldContext.Provider value={{ eldData }}>
      {children}
    </EldContext.Provider>
  );
}

export const useEld = () => useContext(EldContext);
