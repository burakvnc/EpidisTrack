/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import config from '../../../config';
import GoogleSign from './GoogleSign';
export default function LoginScreen({navigation}) {
  const [shadowOpacity, setShadowOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const shadowOpacityAnimation = Animated.timing(shadowOpacity, {
      toValue: 500,
      duration: 2000,
      useNativeDriver: true,
    });
    const shadowOpacityReverseAnimation = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(shadowOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]);
    const shadowOpacityLoop = Animated.sequence([
      shadowOpacityAnimation,
      shadowOpacityReverseAnimation,
    ]);
    const animatedShadow = Animated.loop(shadowOpacityLoop);
    animatedShadow.start();
    return () => {
      animatedShadow.stop();
    };
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const auth = getAuth();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.stretch}
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/epidis.png?alt=media&token=1120c793-ac77-4a86-9d4a-3dc1ea024073',
        }}
      />
      <View style={[styles.inputContainer, styles.box]}>
        <TextInput
          placeholder="Email Adresiniz"
          placeholderTextColor={'#909090'}
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Şifreniz"
          placeholderTextColor={'#909090'}
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <GoogleSign />
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
          style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.buttonOutlineText}>Hesabınız yok mu? </Text>
            <Text style={styles.buttonOutlineText2}>Kayıt Olun.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowRadius: 6,
    elevation: 15,
    backgroundColor: '#181818',
  },
  box: {
    backgroundColor: '#0a2f35',
    shadowColor: '#eee',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 225,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a2f35',
  },
  stretch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height:'15%',
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '80%',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '30%',
  },
  input: {
    backgroundColor: '#EAE7FF',
    color: '#181818',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#181818',
    width: '85%',
    justifyContent: 'center',
    alignContent: 'center',
    fontFamily: 'CaviarDreams',
    fontWeight: '600',
    fontSize: 16,
    height: 50,
  },
  buttonContainer: {
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#e56647',
    width: '100%',
    height: 50,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#f56038',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
  buttonOutlineText: {
    color: '#eee',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
  buttonOutlineText2: {
    color: '#f7a325',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
});
