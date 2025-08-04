// screens/DrawerScreens/LogScreens/LogStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LogsFormScreen from './LogsFormScreen'
import LogsDetailScreen from './LogsDetailScreen'

const Stack = createNativeStackNavigator()

export default function LogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogsForm" component={LogsFormScreen} />
      <Stack.Screen name="LogsDetail" component={LogsDetailScreen} />
    </Stack.Navigator>
  )
}
