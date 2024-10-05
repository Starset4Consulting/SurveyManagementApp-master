import React, { useState, useEffect } from 'react'; 
import Header from '../components/Header';
import { View, Text, Button, FlatList, Alert } from 'react-native';

const SurveyListScreen = ({ navigation, route }) => {
  // Retrieve the userId and isAdmin flag from the route params
  const { userId, isAdmin } = route.params || {}; 

  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('https://f1dc-103-57-255-139.ngrok-free.app/surveys');
        console.log(`Fetch Surveys Response Status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text(); // Get the response as text
          console.error('Error response body:', errorText); // Log the error body
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Surveys Data:', data);
        
        if (data.surveys) {
          setSurveys(data.surveys);
        } else {
          console.error("No surveys found");
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, [userId]);

  // Function to handle the survey start
  const handleStartSurvey = (surveyId) => {
    navigation.navigate('SurveyTaking', { surveyId, userId });
  };

  // Function to handle the survey deletion (admin only)
  const handleDeleteSurvey = async (surveyId) => {
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to delete this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
            try {
              const response = await fetch(`https://709c-103-177-59-249.ngrok-free.app/surveys/${surveyId}`, {
                method: 'DELETE',
              });
              const data = await response.json();
              
              if (response.ok) {
                Alert.alert('Success', data.message);
                setSurveys(surveys.filter(survey => survey.id !== surveyId)); // Remove the deleted survey from the list
              } else {
                Alert.alert('Error', data.error || 'Failed to delete survey');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting the survey');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Survey List" />
      <View style={{ padding: 20 }}>
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Button title="Start Survey" onPress={() => handleStartSurvey(item.id)} />
              {/* Show the Delete button only if the user is an admin */}
              {isAdmin && (
                <Button
                  title="Delete Survey"
                  color="red"
                  onPress={() => handleDeleteSurvey(item.id)}
                />
              )}
            </View>
          )}
        />
      </View>
      {isAdmin && (
        <Button
          title="Create New Survey"
          onPress={() => navigation.navigate('SurveyCreation', { userId })} // Corrected to 'SurveyCreation'
        />
      )}
    </View>
  );
};

export default SurveyListScreen;
