// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // your main app screens
import AuthNavigator from './src/navigation/AuthNavigator'; // login flow
import { UserProvider, useUser } from './src/context/User';
import {EldProvider} from './src/context/EldContext'

// Wrapper that decides which navigator to show
function RootNavigator() {
  const { user } = useUser();

  return (
    <NavigationContainer>
      {/* If user exists → show main app, else → login */}
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <EldProvider>
    <UserProvider>
      <RootNavigator />
    </UserProvider>
    </EldProvider>
  );
}
