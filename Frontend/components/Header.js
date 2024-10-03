// components/Header.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <Image 
                source={require('../assets/logo.png')}  // Add your logo here
                style={styles.logo} 
            />
            <Text style={styles.title}>Starset Services</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',  // White background for the header
        height: 70,
        flexDirection: 'row',
        alignItems: 'flex-end',  // Align items to the bottom
        justifyContent: 'flex-start',  // Align logo to the left
        paddingHorizontal: 20,
        paddingBottom: 5,  // Slight padding from the bottom
        marginTop: -5,  // Slightly raise the header
    },
    logo: {
        width: 50,  // Keep the larger logo size
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,  // Add some margin to the bottom of the logo
    },
    title: {
        fontSize: 22,  // Slightly larger font size for the title
        color: '#4B0082',  // Blue color for the text
        fontWeight: 'bold',
        marginLeft: 20,  // Space between the logo and text
        marginBottom: 15,  // Add margin to the bottom of the text
    },
});

export default Header;