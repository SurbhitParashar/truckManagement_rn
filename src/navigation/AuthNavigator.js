// src/navigation/AppNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import EldConnectScreen from '../screens/EldConnectScreen';
import HomeScreen from '../screens/HomeScreen';

import AccountScreen from '../screens/DrawerScreens/AccountScreen';
import CoDriverScreen from '../screens/DrawerScreens/CoDriverScreen';
import DOTInspectionScreen from '../screens/DrawerScreens/DOTInspectionScreen';
import DVIRStack from '../screens/DrawerScreens/DVIRScreens/DVIRStack';
import InfoPacketScreen from '../screens/DrawerScreens/InfoPacketScreen';
import LogStack from '../screens/DrawerScreens/LogScreens/LogsStack';
import RulesScreen from '../screens/DrawerScreens/RulesScreen';
import SelectVehicleScreen from '../screens/DrawerScreens/SelectVehicleScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer with all main app features
const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Logs" component={LogStack} />
    <Drawer.Screen name="DVIR" component={DVIRStack} />
    <Drawer.Screen name="DOT Inspection" component={DOTInspectionScreen} />
    <Drawer.Screen name="Rules" component={RulesScreen} />
    <Drawer.Screen name="Co Driver" component={CoDriverScreen} />
    <Drawer.Screen name="Select Vehicle" component={SelectVehicleScreen} />
    <Drawer.Screen name="Account" component={AccountScreen} />
    <Drawer.Screen name="Information Packet" component={InfoPacketScreen} />
  </Drawer.Navigator>
);

// Stack for auth + main app
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EldConnectScreen" component={EldConnectScreen} />
      <Stack.Screen name="HomeScreen" component={DrawerNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
