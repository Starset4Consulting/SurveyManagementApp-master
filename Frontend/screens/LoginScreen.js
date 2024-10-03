// screens/LoginScreen.js
import React, { useState } from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Use the backend URL
    const apiUrl = 'https://0da6-103-177-59-249.ngrok-free.app/login'; // Replace <YOUR_IP_ADDRESS> with your actual backend IP

    // Check if it's admin login
    if (username === 'Admin' && password === 'password@123') {
      navigation.navigate('AdminDashboard'); // Admin Dashboard
      return;
    }

    // Regular user login
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      

      const data = await response.json();

      if (data.success) {
        // Navigate to the user dashboard if login is successful
        navigation.navigate('SurveyList', { userId: data.user_id });
      } else {
        // Alert for invalid username or password
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
      console.error('Error during login:', error);
    }
  };

  

  return (
    <View style={{ flex: 1 }}>
      {/* Render the header component */}
      <Header />
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Login</Text>

      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{
          marginTop: 20,
          backgroundColor: '#28a745',
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white' }}>Register</Text>
      </TouchableOpacity>
    </View>
    </View>
    
  );
};

export default LoginScreen;
