import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Import the Header component
import { View, Text, Button, FlatList, Alert } from 'react-native';

const SurveyListScreen = ({ navigation, route }) => {
  // Retrieve the userId from the route params
  const { userId } = route.params || {}; // Use destructuring with a fallback

  const [surveys, setSurveys] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  // Log the userId to check if it's correctly retrieved
  console.log('userId:', userId);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('https://0da6-103-177-59-249.ngrok-free.app/surveys');
        const data = await response.json();
        // Check if the response contains surveys and update the state
        if (data.surveys) {
          setSurveys(data.surveys);
        } else {
          console.error("No surveys found");
        }

        // Optional: Check if the user is an admin (you might have an admin flag in your user data)
        if (userId) {
          const userResponse = await fetch(`https://0da6-103-177-59-249.ngrok-free.app/users/${userId}`);
          const userData = await userResponse.json();
          if (userData.isAdmin) { // Assuming isAdmin is a boolean field in the user data
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, [userId]); // Added userId as a dependency

  // Function to handle the survey start and pass userId and surveyId
  const handleStartSurvey = (surveyId) => {
    // Navigate to SurveyTakingScreen with both surveyId and userId
    navigation.navigate('SurveyTaking', { surveyId: surveyId, userId: userId });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Render the Header at the top */}
      <Header title="Survey List" />
      <View style={{ padding: 20 }}>
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              {/* Pass surveyId and userId when starting the survey */}
              <Button title="Start Survey" onPress={() => handleStartSurvey(item.id)} />
            </View>
          )}
        />
      </View>
      {isAdmin && (
        <Button
          title="Create New Survey"
          onPress={() => navigation.navigate('CreateSurvey', { userId })} // Assuming you have a CreateSurvey screen
        />
      )}
    </View>
  );
};

export default SurveyListScreen;
