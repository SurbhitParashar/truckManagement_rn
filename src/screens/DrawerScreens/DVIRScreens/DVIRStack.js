// screens/DrawerScreens/DVIRScreens/DVIRStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DVIRListScreen   from './DVIRListScreen';
import InsertDVIRScreen from './InsertDVIRScreen';
import DVIRDetailScreen from './DVIRDetailScreen';

const Stack = createNativeStackNavigator();

export default function DVIRStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DVIRList"   component={DVIRListScreen}   />
      <Stack.Screen name="InsertDVIR" component={InsertDVIRScreen} />
      <Stack.Screen name="DVIRDetail" component={DVIRDetailScreen} />
    </Stack.Navigator>
  );
}
