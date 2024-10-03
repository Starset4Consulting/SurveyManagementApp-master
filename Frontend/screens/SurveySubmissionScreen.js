import React from 'react';
import { View, Text, Button } from 'react-native';

const SurveySubmissionScreen = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Thank you for your submission!</Text>
      <Button title="Back to Survey List" onPress={() => navigation.navigate('SurveyList')} />
    </View>
  );
};

export default SurveySubmissionScreen;
