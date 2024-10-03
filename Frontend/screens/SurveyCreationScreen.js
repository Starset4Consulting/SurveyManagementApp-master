import React, { useState } from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';

const SurveyCreationScreen = ({ navigation }) => {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [''] }]);
  
  // Function to handle adding a new question
  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: [''] }]);
  };

  // Function to handle adding a new option to a specific question
  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  // Function to update a specific question text
  const updateQuestionText = (text, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = text;
    setQuestions(newQuestions);
  };

  // Function to update a specific option text for a specific question
  const updateOptionText = (text, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = text;
    setQuestions(newQuestions);
  };

  // Function to handle survey submission
  const handleCreateSurvey = async () => {
    // Validate that the survey name and questions are provided
    if (!surveyName || questions.some(q => !q.text || q.options.some(option => !option))) {
      Alert.alert('Error', 'Please fill out all questions and options.');
      return;
    }

    try {
      // Make API call to create survey
      const response = await fetch('https://0da6-103-177-59-249.ngrok-free.app/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: surveyName, questions }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Survey creation successful, navigate to the survey list
        Alert.alert('Success', 'Survey created successfully!');
        navigation.navigate('SurveyList');
      } else {
        Alert.alert('Error', 'Failed to create survey.');
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      Alert.alert('Error', 'An error occurred while creating the survey. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Render the Header at the top */}
      <Header title="Create Survey" />
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Survey Name</Text>
      <TextInput
        value={surveyName}
        onChangeText={setSurveyName}
        placeholder="Enter survey name"
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
          borderColor: '#ccc',
        }}
      />

      {/* Dynamically render each question with options */}
      {questions.map((question, questionIndex) => (
        <View key={questionIndex} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>Question {questionIndex + 1}</Text>
          <TextInput
            value={question.text}
            onChangeText={(text) => updateQuestionText(text, questionIndex)}
            placeholder="Enter question text"
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              borderColor: '#ccc',
            }}
          />

          <Text style={{ fontSize: 14, marginBottom: 5 }}>Options</Text>
          {question.options.map((option, optionIndex) => (
            <TextInput
              key={optionIndex}
              value={option}
              onChangeText={(text) => updateOptionText(text, questionIndex, optionIndex)}
              placeholder={`Option ${optionIndex + 1}`}
              style={{
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                borderColor: '#ccc',
              }}
            />
          ))}

          {/* Button to add more options for this question */}
          <TouchableOpacity
            onPress={() => addOption(questionIndex)}
            style={{
              backgroundColor: '#007bff',
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white' }}>Add Option</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Button to add a new question */}
      <TouchableOpacity
        onPress={addQuestion}
        style={{
          backgroundColor: '#28a745',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Add Question</Text>
      </TouchableOpacity>

      {/* Button to submit the survey */}
      <Button title="Create Survey" onPress={handleCreateSurvey} />
    </ScrollView>
    </View>
  );
};

export default SurveyCreationScreen;
