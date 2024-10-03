// components/SurveyQuestion.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const SurveyQuestion = ({ question, options, onSelect }) => {
  return (
    <View>
      <Text>{question}</Text>
      {options.map((option, index) => (
        <Button key={index} title={option} onPress={() => onSelect(option)} />
      ))}
    </View>
  );
};

export default SurveyQuestion;
