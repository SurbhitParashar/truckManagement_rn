import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import EldConnectScreen from '../screens/ELDConnectScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Status" component={HomeScreen} />
    <Drawer.Screen name="Logs" component={HomeScreen} />
    <Drawer.Screen name="DVIR" component={HomeScreen} />
    <Drawer.Screen name="DOT Inspection" component={HomeScreen} />
    <Drawer.Screen name="Rules" component={HomeScreen} />
    <Drawer.Screen name="Co Driver" component={HomeScreen} />
    <Drawer.Screen name="Select Vehicle" component={HomeScreen} />
    <Drawer.Screen name="Account" component={HomeScreen} />
    <Drawer.Screen name="Information Packet" component={HomeScreen} />
    <Drawer.Screen name="Logout" component={LoginScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ELDConnectScreen" component={EldConnectScreen} />
        <Stack.Screen name="HomeScreen" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
