import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Text, Button, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const SurveyTakingScreen = ({ route }) => {
  const { surveyId, userId, username } = route.params; // Include username
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastSurveyLocation, setLastSurveyLocation] = useState(null); // To track the last survey location
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`https://0da6-103-177-59-249.ngrok-free.app/surveys/${surveyId}`);
        const data = await response.json();

        console.log('Fetched survey data:', data); // Debugging: Check if data is being fetched correctly

        // Check if survey and questions exist
        if (data && data.questions) {
          setSurvey(data);
        } else {
          Alert.alert('Error', 'Survey data not found or incomplete.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load survey data');
        console.error('Error fetching survey:', error);
      } finally {
        setLoading(false);
      }
    };

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };

    fetchSurvey();
    requestLocationPermission();
  }, [surveyId]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const isWithinFiveMeters = async () => {
    if (lastSurveyLocation) {
      const distance = Location.distance(
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        { latitude: lastSurveyLocation.latitude, longitude: lastSurveyLocation.longitude }
      );
      return distance < 5; // Returns true if within 5 meters
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is not available. Please log in.');
      return;
    }

    const withinFiveMeters = await isWithinFiveMeters();
    if (withinFiveMeters) {
      Alert.alert('Error', 'You cannot take multiple surveys in this location within 5 meters.');
      return;
    }

    try {
      const response = await fetch('https://0da6-103-177-59-249.ngrok-free.app/submit_survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId, 
          survey_id: surveyId, 
          responses: answers, 
          location: JSON.stringify({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          }), 
          voice_recording_path: recordingUri // Include audio file path
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Update lastSurveyLocation with the current location upon successful submission
        setLastSurveyLocation(currentLocation);
        Alert.alert('Success', 'Survey responses submitted successfully!');
      } else {
        Alert.alert('Error', 'same entry within 5mts.');
      }
    } catch (error) {
      Alert.alert('Error', 'Submission failed. Try again later.');
      console.error('Error submitting survey responses:', error);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access microphone was denied');
        return;
      }

      const recording = new Audio.Recording();
      const fileName = `${username}_${surveyId}_${Date.now()}.m4a`; // Generate filename
      const uri = `${FileSystem.documentDirectory}${fileName}`;
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setRecordingUri(uri); // Set the recording URI
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      Alert.alert('Recording saved!', `Audio file: ${recordingUri}`);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!survey) {
    return <Text>Error loading survey.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Render the Header */}
      <Header title="Take Survey" />
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{survey.name}</Text>
      
      <FlatList
        data={survey.questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 10 }}>
            {/* Display the question text */}
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{item.text}</Text>
            {item.options.map((option, optIndex) => (
              <TouchableOpacity
              key={optIndex}
              onPress={() => handleAnswerSelect(index, option)}
              style={[
                styles.optionButton,
                answers[index] === option && styles.selectedOptionButton, // Apply selected style
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[index] === option && styles.selectedOptionText, // Apply selected text style
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
            ))}
          </View>
        )}
      />
      
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Answers</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};
const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff', // Default background
  },
  selectedOptionButton: {
    backgroundColor: '#4CAF50', // Highlighted background color
  },
  optionText: {
    fontSize: 16,
    color: '#000', // Default text color
  },
  selectedOptionText: {
    color: '#fff', // Text color for selected option
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SurveyTakingScreen;
