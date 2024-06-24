import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import NotificationScreen from './src/NotificationScreen';
import NavigationService from './src/NavigationService';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App