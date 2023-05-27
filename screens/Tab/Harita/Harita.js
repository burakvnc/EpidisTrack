/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Map from './Map';
import FAB from './FAB';

export default function Harita({navigation}) {

  
  return (
    <View style={{backgroundColor: '#0a2f35', flex: 1}}>
      <Map />
      <FAB
        onPress={() => navigation.navigate('HastalikEkle')}
        title="Hastalık Ekle"
      />
    </View>
  );
}
