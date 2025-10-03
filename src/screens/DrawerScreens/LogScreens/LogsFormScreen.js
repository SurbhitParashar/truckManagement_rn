// src/screens/DrawerScreens/LogScreens/LogsList.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getLogs, saveStatusChange } from '../../../services/LogManager';
import { useUser } from '../../../context/User';

export default function LogsList() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [logs, setLogs] = useState([]);

  // 🔹 Function to fetch logs
  const fetchLogs = useCallback(async () => {
    if (!user?.id) {
      console.log("⚠️ No user id found in context");
      return;
    }

    // console.log("👤 Fetching logs for driver:", user.id);
    const data = await getLogs(user.id);

    // console.log("📌 Logs from AsyncStorage:", JSON.stringify(data, null, 2)); // Debug print

    setLogs(data);
  }, [user]);

  // 🔹 Fetch on screen mount
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 🔹 TEMP button to simulate log saving for testing
  const addTestLog = async () => {
    await saveStatusChange(user?.id || "test_driver", "ON_DUTY");
    console.log("✅ Test log saved!");
    fetchLogs();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('LogsDetail', { log: item })}
    >
      <View style={styles.left}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.events.length} events</Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Logs</Text>

      {/* 🔹 Debug test button */}
      <TouchableOpacity style={styles.testButton} onPress={addTestLog}>
        <Text style={styles.testButtonText}>➕ Add Test Log</Text>
      </TouchableOpacity>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, color: '#007AFF', fontWeight: '600', padding: 16 },
  list: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: { flex: 1 },
  date: { fontSize: 18, color: '#222', fontWeight: '500' },
  time: { fontSize: 14, color: '#666', marginTop: 4 },
  right: { flexDirection: 'row', alignItems: 'center' },
  testButton: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
