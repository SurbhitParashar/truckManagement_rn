// MyAccountScreen.js

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccountItem = ({ label, value, onPress, showArrow }) => (
  <TouchableOpacity
    activeOpacity={onPress ? 0.7 : 1}
    onPress={onPress}
    style={styles.itemContainer}
  >
    <Text style={styles.itemLabel}>{label}</Text>
    <View style={styles.valueRow}>
      <Text style={styles.itemValue}>{value}</Text>
      {showArrow && (
        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={styles.itemValue.color}
        />
      )}
    </View>
  </TouchableOpacity>
);

export default function MyAccountScreen({ navigation }) {
  const onRefresh = () => {
    // your refresh logic
  };

  const changeLanguage = () => {
    // open language picker
  };

  const changeOdometer = () => {
    // open odometer unit picker
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- Content --- */}
      <ScrollView contentContainerStyle={styles.content}>
        <AccountItem label="Email" value="test12@gmail.com" />
        <AccountItem label="Name" value="gagan CME-26" />
        <AccountItem label="License" value="BH123D43Q" />
        <AccountItem label="License State" value="CA" />
        <AccountItem label="Carrier" value="test" />
        <AccountItem label="Main Office Address" value="test" />
        <AccountItem label="Home Terminal Address" value="werwer" />
        <AccountItem label="Time Zone" value="America/Los_Angeles" />
        <AccountItem
          label="Language"
          value="English"
          showArrow
          onPress={changeLanguage}
        />
        <AccountItem
          label="Odometer"
          value="mi"
          showArrow
          onPress={changeOdometer}
        />

        <Text style={styles.footerText}>
          Please contact your fleet manager to change your account information
        </Text>
        <Text style={styles.versionText}>Version - 1.3.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0057d9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // elevation for Android
    elevation: 2,
  },
  itemLabel: {
    fontSize: 15,
    color: '#002c5f',
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 15,
    color: '#0057d9',
    fontWeight: '600',
    marginRight: 4,
  },
  footerText: {
    textAlign: 'center',
    color: '#4a6fa1',
    fontSize: 14,
    marginTop: 24,
    lineHeight: 20,
  },
  versionText: {
    textAlign: 'center',
    color: '#4a6fa1',
    fontSize: 13,
    marginTop: 8,
  },
});
