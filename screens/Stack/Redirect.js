import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View,Text } from 'react-native';
import React from 'react';

export default function Redirect() {
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
       CommonActions.reset({
         index: 1,
         routes: [{ name: 'LoginScreen' }],
       })
     );
    }, 1)
  }, [])

  return (
    <View style={{backgroundColor:"#181818",height:"100%",width:"100%"}}><Text></Text></View>
  );
}