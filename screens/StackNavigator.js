/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './Stack/LoginScreen/LoginScreen';
import RegisterScreen from './Stack/RegisterScreen/RegisterScreen';
import Intro from './Stack/IntroScreen/Intro';
import CreateProfile from './Stack/CreateProfile/CreateProfile';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

export default function StackNavigator({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: '#eee',
        headerStyle: {
          backgroundColor: '#0a2f35',
          shadowColor: 'transparent',
          elevation: 0,
        },
      }}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Intro"
        component={Intro}
      />
      <Stack.Screen
        options={{headerShown: true, title: ''}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: true, title: ''}}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{headerShown: true, title: ''}}
        name="CreateProfile"
        component={CreateProfile}
      />
    </Stack.Navigator>
  );
}
