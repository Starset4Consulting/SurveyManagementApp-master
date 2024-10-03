// components/SurveyForm.js
import React from 'react';
import { View, TextInput } from 'react-native';

const SurveyForm = ({ onAnswerChange }) => {
  return (
    <View>
      <TextInput
        placeholder="Your answer"
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        onChangeText={onAnswerChange}
      />
    </View>
  );
};

export default SurveyForm;
