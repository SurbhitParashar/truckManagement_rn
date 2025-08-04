import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default ({ btEnabled, locEnabled, onToggleBluetooth, onToggleLocation }) => (
  <View style={styles.header}>
    <Icon name="swap-horiz" size={24} color="#000" />
    <Text style={styles.headerTitle}>A1</Text>
    <TouchableOpacity onPress={onToggleBluetooth}>
      <Icon name={btEnabled ? 'bluetooth' : 'bluetooth-disabled'} size={24} color={btEnabled ? 'blue' : 'red'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onToggleLocation} style={{ marginLeft: 10 }}>
      <Icon name={locEnabled ? 'location-on' : 'location-off'} size={24} color={locEnabled ? 'blue' : 'red'} />
    </TouchableOpacity>
  </View>
);
