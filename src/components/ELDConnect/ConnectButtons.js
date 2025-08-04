import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default ({ onConnect, onContinue, disabled }) => (
  <View style={{ paddingHorizontal: 20 }}>
    <TouchableOpacity style={styles.connectBtn} onPress={onConnect} disabled={disabled}>
      <Text style={styles.connectText}>{disabled ? 'CONNECTING...' : 'CONNECT'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.disconnectBtn} onPress={onContinue}>
      <Text style={styles.disconnectText}>CONTINUE DISCONNECTED</Text>
    </TouchableOpacity>
  </View>
);
