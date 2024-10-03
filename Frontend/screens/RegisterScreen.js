// screens/RegisterScreen.js
import React, { useState } from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Store the user data or send it to the backend
    const response = await fetch('https://0da6-103-177-59-249.ngrok-free.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, username, password }),
    });
    const data = await response.json();
    if (data.success) {
      alert('Registration successful!');
      navigation.navigate('Login');
    } else {
      alert('Registration failed. Try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Render the header component */}
      <Header />
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Register</Text>

      <Text>Phone Number</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

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

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{
          marginTop: 20,
          backgroundColor: '#007bff',
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white' }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default RegisterScreen;
