import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default ({ value, onChange }) => (
  <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
    <Text style={styles.inputLabel}>Enter ELD MAC address listed on the device</Text>
    <TextInput
      style={styles.input}
      placeholder="0271"
      keyboardType="default"
      value={value}
      onChangeText={onChange}
    />
  </View>
);
