import * as Location from 'expo-location';

export async function enableLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');
  const loc = await Location.getCurrentPositionAsync({});
  return !!loc;
}
