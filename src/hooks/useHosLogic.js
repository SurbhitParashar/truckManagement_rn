import { useEffect, useState, useRef } from 'react';
import EventBus from '../services/EventBus';
import {
  MAX_DRIVE,
  MAX_ON_DUTY_WINDOW,
  BREAK_DRIVE_LIMIT,
  BREAK_MIN,
  CYCLE_LIMIT,
  RESTART_OFF
} from '../utils/fmcsarules';
import { saveStatusChange } from '../services/LogManager'; // <-- New service

export default function useHosLogic(driverId) {
  const [state, setState] = useState({
    status: 'OFF_DUTY', // OFF_DUTY, SLEEPER, DRIVE, ON_DUTY, PERSONAL_CONVEYANCE, YARD_MOVE
    windowStart: null,
    driveSinceLastBreak: 0,
    driveThisWindow: 0,
    cycleUsed: 0,
    lastOffDutyStart: null,
    offDutyAccumulated: 0
  });

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const updateState = (updater) => {
    setState((s) => ({ ...s, ...updater(s) }));
  };

  const stopTimerRef = useRef(null);

  const onTick = (now) => {
    updateState((s) => {
      const delta = 1;
      let {
        status,
        driveSinceLastBreak,
        driveThisWindow,
        cycleUsed,
        windowStart,
        lastOffDutyStart,
        offDutyAccumulated
      } = s;

      if (!windowStart && (status === 'ON_DUTY' || status === 'DRIVE')) {
        windowStart = now;
      }

      if (status === 'DRIVE') {
        driveSinceLastBreak += delta;
        driveThisWindow += delta;
        cycleUsed += delta;
        offDutyAccumulated = 0;
      } 
      else if (status === 'ON_DUTY' || status === 'YARD_MOVE') {
        cycleUsed += delta;
        offDutyAccumulated = 0;
      } 
      else if (status === 'SLEEPER') {
        if (!lastOffDutyStart) lastOffDutyStart = now;
        offDutyAccumulated += delta;

        if (offDutyAccumulated >= BREAK_MIN) {
          driveSinceLastBreak = 0;
        }

        if (offDutyAccumulated >= 8 * 3600) {
          if (windowStart) {
            windowStart += offDutyAccumulated; 
          }
        }

        if (now - lastOffDutyStart >= RESTART_OFF) {
          cycleUsed = 0;
          windowStart = null;
        }
      }
      else {
        // OFF_DUTY, PERSONAL_CONVEYANCE
        if (!lastOffDutyStart) lastOffDutyStart = now;
        offDutyAccumulated += delta;
        if (offDutyAccumulated >= BREAK_MIN) {
          driveSinceLastBreak = 0;
        }
        if (now - lastOffDutyStart >= RESTART_OFF) {
          cycleUsed = 0;
          windowStart = null;
        }
      }

      // Auto transition rules
      if (driveSinceLastBreak >= BREAK_DRIVE_LIMIT && status === 'DRIVE') {
        status = 'OFF_DUTY';
        lastOffDutyStart = now;
        offDutyAccumulated = 0;
      }
      if (driveThisWindow >= MAX_DRIVE) {
        status = 'OFF_DUTY';
        lastOffDutyStart = now;
        offDutyAccumulated = 0;
      }
      if (windowStart && (now - windowStart) >= MAX_ON_DUTY_WINDOW) {
        status = 'OFF_DUTY';
        lastOffDutyStart = now;
        offDutyAccumulated = 0;
      }
      if (cycleUsed >= CYCLE_LIMIT) {
        status = 'OFF_DUTY';
        lastOffDutyStart = now;
        offDutyAccumulated = 0;
      }

      return {
        status,
        driveSinceLastBreak,
        driveThisWindow,
        cycleUsed,
        windowStart,
        lastOffDutyStart,
        offDutyAccumulated
      };
    });
  };

  useEffect(() => {
    const offTick = EventBus.on('tick', onTick);

    const onSpeed = (speed) => {
      if (speed > 5) {
        if (stopTimerRef.current) {
          clearTimeout(stopTimerRef.current);
          stopTimerRef.current = null;
        }
        setStatus('DRIVE');
      } else {
        setState((s) => {
          if (s.status === 'DRIVE' && !stopTimerRef.current) {
            stopTimerRef.current = setTimeout(() => {
              setStatus('ON_DUTY');
              stopTimerRef.current = null;
            }, 60 * 1000);
          }
          return s;
        });
      }
    };

    const offSpeed = EventBus.on('speed', onSpeed);

    return () => {
      offTick();
      offSpeed();
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (newStatus) => {
    const now = Date.now() / 1000;

    // Save to logs every time status changes
    try {
      await saveStatusChange(driverId, newStatus);
    } catch (e) {
      console.warn("Log save failed", e);
    }

    updateState((s) => {
      let windowStart = s.windowStart;
      if (newStatus === 'ON_DUTY' || newStatus === 'DRIVE') {
        if (!windowStart || (s.status === 'OFF_DUTY' || s.status === 'SLEEPER')) {
          windowStart = now;
        }
      }

      const lastOffDutyStart = newStatus === 'OFF_DUTY' ? now : s.lastOffDutyStart;
      const offDutyAccumulated = newStatus === 'OFF_DUTY' ? 0 : s.offDutyAccumulated;

      if (newStatus === 'OFF_DUTY' && stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }

      return {
        status: newStatus,
        windowStart,
        lastOffDutyStart,
        offDutyAccumulated
      };
    });

    EventBus.emit('statusChanged', newStatus);
  };

  return { state, setStatus };
}
