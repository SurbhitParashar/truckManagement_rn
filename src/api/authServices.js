// src/api/authService.js
import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(username, password) {
  const resp = await client.post('/auth/login', { username, password });
  const { token, user } = resp.data;
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return {token,user};
}


