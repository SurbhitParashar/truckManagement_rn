import React from 'react';
import { View, Text } from 'react-native';

export default () => (
  <View style={styles.verifyBox}>
    <Text style={styles.instructions}>Please verify the following items:</Text>
    {['ELD MAC address is entered correctly', 'ELD hardware is properly installed', 'Vehicle Power is on', 'Bluetooth is enabled on mobile device', 'GPS is enabled on mobile device'].map((item, idx) => (
      <Text key={idx} style={styles.bullet}>• {item}</Text>
    ))}
  </View>
);
