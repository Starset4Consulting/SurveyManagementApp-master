import React, { useState } from 'react';
import Header from '../components/Header';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const apiUrl = 'https://0da6-103-177-59-249.ngrok-free.app/login'; 

    // Check if it's admin login
    if (username === 'Admin' && password === 'password@123') {
      navigation.navigate('SurveyList', { userId: 1, isAdmin: true }); // Pass `isAdmin: true` for admin
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
        // Pass the `isAdmin: false` flag for normal users
        navigation.navigate('SurveyList', { userId: data.user_id, isAdmin: false });
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
