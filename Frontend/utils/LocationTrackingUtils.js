import * as Location from 'expo-location';

export const getLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  } catch (error) {
    console.log('Error fetching location:', error);
    return null;
  }
};
