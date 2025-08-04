import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import EldConnectScreen from '../screens/EldConnectScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

import AccountScreen from '../screens/DrawerScreens/AccountScreen';
import CoDriverScreen from '../screens/DrawerScreens/CoDriverScreen';
import DOTInspectionScreen from '../screens/DrawerScreens/DOTInspectionScreen';
// import DVIRScreen from '../screens/DrawerScreens/DVIRScreen';
import DVIRStack from '../screens/DrawerScreens/DVIRScreens/DVIRStack';
import InfoPacketScreen from '../screens/DrawerScreens/InfoPacketScreen';
// import LogsScreen from '../screens/DrawerScreens/LogScreens/LogsFormScreen';
// import LogsDetailScreen from '../screens/DrawerScreens/LogScreens/LogsDetailScreen';
import LogStack from '../screens/DrawerScreens/LogScreens/LogsStack';
import RulesScreen from '../screens/DrawerScreens/RulesScreen';
import SelectVehicleScreen from '../screens/DrawerScreens/SelectVehicleScreen';
// import StatusScreen from '../screens/DrawerScreens/StatusScreen';
// import CoDriverScreen from '../screens/DrawerScreens/CoDriverScreen';

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    {/* <Drawer.Screen name="Logs" component={LogsScreen} /> */}
    <Drawer.Screen name="Logs" component={LogStack} />
    {/* <Drawer.Screen name="DVIR" component={DVIRScreen} /> */}
    <Drawer.Screen name="DVIR" component={DVIRStack} />
    <Drawer.Screen name="DOT Inspection" component={DOTInspectionScreen} />
    <Drawer.Screen name="Rules" component={RulesScreen} />
    <Drawer.Screen name="Co Driver" component={CoDriverScreen} />
    <Drawer.Screen name="Select Vehicle" component={SelectVehicleScreen} />
    <Drawer.Screen name="Account" component={AccountScreen} />
    <Drawer.Screen name="Information Packet" component={InfoPacketScreen} />
    {/* <Drawer.Screen name="Logout" component={} /> */}
  </Drawer.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EldConnectScreen" component={EldConnectScreen} />
        <Stack.Screen name="HomeScreen" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
