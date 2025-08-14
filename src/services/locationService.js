import * as Location from 'expo-location';

export async function enableLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');

  const loc = await Location.getCurrentPositionAsync({});
  const [place] = await Location.reverseGeocodeAsync(loc.coords);

  return {
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
    city: place?.city || '',
    state: place?.region || ''
  };
}
