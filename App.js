import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from "react-native-flash-message";

//Screens
import ChooseLocation from './src/screens/ChooseLocation';
import Home from './src/screens/Home';


const App = () => {
    const Stack = createStackNavigator()

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
            </Stack.Navigator>
            <FlashMessage position="top" />
        </NavigationContainer>
    );
};

export default App;