// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import CircularTimer from '../components/CircularTimer';
import useHosLogic from '../hooks/useHosLogic';
import { startHosBackground } from '../services/BackgroundService';
import { startEldBle } from '../services/EldBleService';
import statusOptions from '../utils/statusOptions';
import {
  MAX_DRIVE,
  MAX_ON_DUTY_WINDOW,
  BREAK_DRIVE_LIMIT,
  CYCLE_LIMIT
} from '../utils/fmcsarules';

import { saveStatusChange } from '../services/LogManager';
import { useUser } from '../context/User';


export default function HomeScreen({ navigation }) {

  // const driverId = 'driver123'; // replace with your actual logged-in driver ID
  const { user, setUser, driver, loadDriverProfile } = useUser();


  // only as a debug/testing tool, not in production.
  const handleTest = async () => {
    await saveStatusChange(driverId, 'ON_DUTY');
    console.log('Status saved!');
  };

  const driverId = user?.id || 'guest-driver'; // ✅ use logged-in username

  // Auto-load driver profile when user is available
  useEffect(() => {
    if (user?.id) {
      // console.log("📌 HomeScreen: Fetching driver profile for", user.id);
      loadDriverProfile(user.id); // call backend
    }
  }, [user]);

  // hook must be called before using `state`
  const { state, setStatus } = useHosLogic();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // start background services once
  useEffect(() => {
    startHosBackground(); // emits ticks via EventBus
    startEldBle();
  }, []);

  // ---------- Helpers ----------
  const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
  const secondsToHMS = (secs) => {
    const s = Math.max(0, Math.floor(Number(secs) || 0));
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  // current time in seconds (used to compute live values)
  const now = Date.now() / 1000;

  // ---------- Main ring logic (changes based on status) ----------
  // Decide what main ring shows:
  // - if DRIVE -> show 11-hour drive remaining
  // - if ON_DUTY -> show 14-hour shift remaining
  // - otherwise -> show cycle usage remaining (70-hour)
  let mainLimit = MAX_DRIVE;
  let mainUsed = state.driveThisWindow || 0;
  let mainLabel = 'Drive';

  if (state.status === 'ON_DUTY') {
    mainLimit = MAX_ON_DUTY_WINDOW;
    mainUsed = state.windowStart ? (now - state.windowStart) : 0;
    mainLabel = 'Shift';
  } else if (state.status === 'DRIVE') {
    mainLimit = MAX_DRIVE;
    mainUsed = state.driveThisWindow || 0;
    mainLabel = 'Drive';
  } else {
    // off duty / sleeper / others -> show cycle remaining
    mainLimit = CYCLE_LIMIT;
    mainUsed = state.cycleUsed || 0;
    mainLabel = 'Cycle';
  }

  const mainProgress = clamp01((mainUsed || 0) / (mainLimit || 1));
  const mainRemainingSeconds = Math.max(0, (mainLimit || 0) - (mainUsed || 0));

  // ---------- build small rings (live) ----------
  const rings = [
    {
      label: 'DRIVE',
      value: state.driveThisWindow || 0,
      limit: MAX_DRIVE || 1,
      progress: clamp01((state.driveThisWindow || 0) / (MAX_DRIVE || 1)),
      icon: 'directions-car',
      color: statusOptions.find(o => o.value === 'DRIVE')?.color || '#4CAF50'
    },
    {
      label: 'Shift',
      value: state.windowStart ? Math.max(0, now - state.windowStart) : 0,
      limit: MAX_ON_DUTY_WINDOW || 1,
      progress: clamp01((state.windowStart ? Math.max(0, now - state.windowStart) : 0) / (MAX_ON_DUTY_WINDOW || 1)),
      icon: 'schedule',
      color: statusOptions.find(o => o.value === 'ON_DUTY')?.color || '#2196F3'
    },
    {
      label: 'Break',
      value: state.driveSinceLastBreak || 0,
      limit: BREAK_DRIVE_LIMIT || 1,
      progress: clamp01((state.driveSinceLastBreak || 0) / (BREAK_DRIVE_LIMIT || 1)),
      icon: 'free-breakfast',
      color: statusOptions.find(o => o.value === 'OFF_DUTY')?.color || '#f3215d'
    },
    {
      label: 'Cycle',
      value: state.cycleUsed || 0,
      limit: CYCLE_LIMIT || 1,
      progress: clamp01((state.cycleUsed || 0) / (CYCLE_LIMIT || 1)),
      icon: 'autorenew',
      color: statusOptions.find(o => o.value === 'YARD_MOVE')?.color || '#d7f321'
    }
  ];

  // optional debug logs (remove or gate behind __DEV__)
  if (__DEV__) {
    // eslint-disable-next-line no-console
    // console.log('[HomeScreen] state:', {
    //   status: state.status,
    //   driveThisWindow: state.driveThisWindow,
    //   windowStart: state.windowStart,
    //   cycleUsed: state.cycleUsed
    // });
  }

  // UI rendering
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View animation="fadeInDown" duration={800} style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.subtitle}>Current Driver</Text>
            <Text style={styles.title}>
              {driver ? `${driver.first_name} ${driver.last_name}` : "Loading..."}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bluetooth" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="location-on" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>

      <ScrollView style={styles.contentContainer}>
        {/* Main timer with status dropdown */}
        <Animatable.View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Remaining {mainLabel} Time</Text>

          {/* Main ring */}
          <CircularTimer size={200} strokeWidth={18} progress={mainProgress} color={statusOptions.find(o => o.value === state.status)?.color || '#2196F3'}>
            <Text style={styles.mainTimer}>{secondsToHMS(mainRemainingSeconds)}</Text>

            <TouchableOpacity style={styles.statusContainer} onPress={() => setShowStatusDropdown(true)}>
              <View style={[styles.statusIndicator, { backgroundColor: statusOptions.find(o => o.value === state.status)?.color || '#888' }]} />
              <Text style={styles.status}>{(statusOptions.find(o => o.value === state.status)?.label) || state.status}</Text>
              <Icon name={showStatusDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#555" />
            </TouchableOpacity>
          </CircularTimer>

          {/* Status dropdown modal */}
          <Modal transparent visible={showStatusDropdown} animationType="fade" onRequestClose={() => setShowStatusDropdown(false)}>
            <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPressOut={() => setShowStatusDropdown(false)}>
              <View style={styles.dropdownContainer}>
                {statusOptions.map((opt, idx) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.dropdownItem, idx !== statusOptions.length - 1 && styles.dropdownItemBorder]}
                    onPress={() => {
                      setStatus(opt.value);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Icon name={opt.icon} size={20} color={opt.color} />
                    <Text style={styles.dropdownItemText}>{opt.label}</Text>
                    {state.status === opt.value && <Icon name="check" size={20} color={opt.color} style={styles.dropdownItemCheck} />}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </Animatable.View>

        {/* Section header */}
        <Animatable.View animation="fadeInRight" duration={600} style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <View style={styles.sectionTitleContainer}>
            <Icon name="timer" size={20} color="#555" />
            <Text style={styles.sectionTitle}>Hours of Service</Text>
          </View>
          <View style={styles.dividerLine} />
        </Animatable.View>

        {/* Four-ring grid */}
        <View style={styles.timerGrid}>
          {rings.map((ring, idx) => (
            <Animatable.View
              key={ring.label + idx}
              animation="fadeInUp"
              duration={800}
              delay={idx * 100}
              style={[styles.timerItem, idx % 2 === 0 && styles.rightBorder, idx < 2 && styles.bottomBorder]}
            >
              <View style={styles.timerIconContainer}>
                <Icon name={ring.icon} size={24} color={ring.color} />
              </View>

              <CircularTimer size={100} strokeWidth={10} progress={ring.progress} color={ring.color}>
                <Text style={styles.circleValue}>{secondsToHMS(Math.max(0, ring.limit - ring.value))}</Text>
              </CircularTimer>

              <View style={styles.timerItemLabels}>
                <Text style={styles.timerItemTitle}>{ring.label}</Text>
              </View>
            </Animatable.View>
          ))}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Test Save Status" onPress={handleTest} />
        </View>

        {/* Logout button */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setUser(null)}>
            <Icon name="power-settings-new" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles (kept same / unmodified)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerContainer: {
    backgroundColor: '#1a237e',
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  },
  header: { flexDirection: 'row', padding: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 7 },
  headerTextContainer: { flex: 1 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 20, position: 'relative' },
  contentContainer: { flex: 1, paddingHorizontal: 10 },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  timerLabel: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: '600' },
  mainTimer: { fontSize: 32, color: '#1a237e', fontWeight: 'bold', textAlign: 'center' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, padding: 5, borderRadius: 20, backgroundColor: '#f8f9fa' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  status: { fontSize: 16, fontWeight: '600', color: '#555', marginRight: 5 },
  dropdownOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, marginLeft: 15, color: '#333', flex: 1 },
  dropdownItemCheck: { marginLeft: 10 },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 15, marginTop: 10 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 5, color: '#333' },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15
  },
  timerItem: { width: '50%', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5 },
  timerIconContainer: { position: 'absolute', top: 10, right: 20, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.9)', padding: 5, borderRadius: 20 },
  rightBorder: { borderRightWidth: 1, borderRightColor: '#f0f0f0' },
  bottomBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  timerItemLabels: { alignItems: 'center', marginTop: 8 },
  timerItemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  circleValue: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  logoutButtonText: { color: '#fff', fontWeight: '600', marginLeft: 8 }
});
