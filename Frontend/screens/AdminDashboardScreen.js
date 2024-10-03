// screens/AdminDashboardScreen.js
import React from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Button } from 'react-native';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Render the Header at the top */}
      <Header title="Admin Dashboard" />
      {/* Render the rest of the content below the Header */}
    <View style={{ padding: 20 }}>
      <Button title="Create Survey" onPress={() => navigation.navigate('SurveyCreation')} />
      <Button title="View Survey List" onPress={() => navigation.navigate('SurveyList')} />
    </View>
    </View>
  );
};

export default AdminDashboardScreen;
