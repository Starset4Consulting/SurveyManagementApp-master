// App.js
import React from 'react';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import SurveyListScreen from './screens/SurveyListScreen';
import SurveyCreationScreen from './screens/SurveyCreationScreen';
import SurveyTakingScreen from './screens/SurveyTakingScreen';
import SurveySubmissionScreen from './screens/SurveySubmissionScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="SurveyList" component={SurveyListScreen} />
        <Stack.Screen name="SurveyCreation" component={SurveyCreationScreen} />
        <Stack.Screen name="SurveyTaking" component={SurveyTakingScreen} />
        <Stack.Screen name="SurveySubmission" component={SurveySubmissionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 // Function to fetch location and permissions
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to take surveys.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

export default App;
