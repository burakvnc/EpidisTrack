/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useContext, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import {SignInContext} from '../../../authContext';
export default function Ayarlar() {
  const {dispatchSignedIn} = useContext(SignInContext);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignOut = () => {
    dispatchSignedIn({
      type: 'UPDATE_SIGN_IN',
      payload: {userToken: 'signed-out'},
    });

    AsyncStorage.setItem('userToken', 'signed-out')
      .then(() => {
        console.log('Logged out successfully');
        // Show alert
        Alert.alert('Hesap Başarıyla Silindi', '', [
          {text: 'Tamam', onPress: () => console.log('OK Pressed')},
        ]);
      })
      .catch(error => {
        console.error('Error setting user token to signed-out:', error);
      });
  };
  const [expanded, setExpanded] = useState(false);
  const heightAnimation = useState(new Animated.Value(60))[0];

  const handlePress = () => {
    if (expanded) {
      // Collapse the component
      Animated.timing(heightAnimation, {
        toValue: 60,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      // Expand the component
      Animated.timing(heightAnimation, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    // Toggle the expanded state
    setExpanded(!expanded);
  };
  return (
    <View style={{backgroundColor: '#0a2f35', flex: 1}}>
      <View style={{}}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#0a2f35',
            height: 60,
            width: '100%',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,

            elevation: 8,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#eee',
              fontFamily: 'CaviarDreams',
              paddingLeft: '10%',
            }}>
            Hesabımı Sil
          </Text>
          <View style={{paddingRight: '9%'}}>
            <Lottie
              speed={0.5}
              progress={animationProgress.current}
              loop
              autoPlay
              source={require('../../../Props/lottie/delete.json')}
              style={{height: 42, width: 42}}
            />
          </View>
        </TouchableOpacity>
        <Animated.View
          style={{
            flexDirection: 'column',
            backgroundColor: '#0a2f35',
            width: '100%',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            height: heightAnimation,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              flexDirection: 'row',
              height:60,
              alignItems: 'center',
              alignContent:'center',
              justifyContent: 'space-between',
            }}
            onPress={handlePress}>
            <Text
              style={{
                color: '#eee',
                fontFamily: 'CaviarDreams',
                paddingLeft: '10%',
              }}>
              Uygulama Hakkında
            </Text>
            <View style={{paddingRight: '10%'}}>
              <Lottie
                speed={0.5}
                progress={animationProgress.current}
                loop
                autoPlay
                source={require('../../../Props/lottie/info.json')}
                style={{height: 32, width: 32}}
              />
            </View>
          </TouchableOpacity>

          {expanded && (
            <View
              style={{
                paddingHorizontal: '10%',
                width: '100%',
                height:'100%',
                justifyContent:'center',
                
              }}>
              <Text
                style={{
                  color: '#eee',
                  fontFamily: 'CaviarDreams',
                  fontSize:12,
                }}>
                Bu uygulama bir Salgın Takip Uygulamasıdır. Uygulamada önemli amaç hastaların bilgilerini doğru şekilde girmesini sağlamak ve yaşanacak salgınların önüne geçmektir.
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
      <View
        style={{
          alignContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          width: '100%',
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#eee',
            fontFamily: 'CaviarDreams',
            fontSize: 9,
          }}>
          2023™
        </Text>
      </View>
    </View>
  );
}
