/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Harita from './Harita';
import HastalikEkle from './HastalikEkle';
const Stack = createNativeStackNavigator();

export default function HaritaStack({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerMode: 'screen',
        headerTintColor: '#eee',
        headerStyle: {
          backgroundColor: '#0a2f35',
        },
        headerTitleStyle: {
          fontFamily: 'CaviarDreams', // Replace with the desired font family
          fontSize: 18, // Adjust the font size if needed
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => <></>,
      }}>
      <Stack.Screen
        options={{
          title: 'Hastalık Haritası',
          presentation: 'containedModal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="Harita"
        component={Harita}
      />
      <Stack.Screen
        options={{
          title: 'Hastalık Ekle',
          presentation: 'containedModal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        name="HastalikEkle"
        component={HastalikEkle}
      />
    </Stack.Navigator>
  );
}
