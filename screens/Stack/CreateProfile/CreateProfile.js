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
import {useState, useCallback} from 'react';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import config from '../../../config';
import {doc, setDoc} from 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';

export default function CreateProfile({route, navigation}) {
  const {email, password} = route.params;
  console.log(email, password);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(1);
  const [kangrubu, setKangrubu] = useState('');
  const [cinsiyet, setcinsiyet] = useState('');
  const auth = getAuth();
  const isValidPhoneNumber = phoneNumber => {
    // Telefon numarasının uzunluğunu kontrol etmek
    if (phoneNumber.length !== 10) {
      return false;
    }

    // İlk rakamın 5 olduğunu kontrol etmek
    if (phoneNumber.charAt(0) !== '5') {
      return false;
    }

    // İkinci rakamın 3, 4 veya 5 olduğunu kontrol etmek
    const secondDigit = phoneNumber.charAt(1);
    if (secondDigit !== '3' && secondDigit !== '4' && secondDigit !== '5') {
      return false;
    }

    // Diğer rakamların 0 ile 9 arasında olduğunu kontrol etmek
    for (let i = 2; i < 10; i++) {
      const digit = phoneNumber.charAt(i);
      if (isNaN(digit) || parseInt(digit) < 0 || parseInt(digit) > 9) {
        return false;
      }
    }

    return true;
  };
  const firestore = getFirestore();
  const handlePhoneChange = text => {
    // İlk 10 karakteri almak
    const formattedText = text.substring(0, 10);
    // Sadece 5 ile başlayan ve diğer karakterlerin 0-9 arasında olduğu bir değeri set etmek
    setPhone(formattedText.replace(/[^5\d]/g, ''));
  };
  // Kullanıcıdan alınan telefon numarasını kontrol etmek
  if (isValidPhoneNumber(phone)) {
    console.log('Telefon numarası geçerli.');
  } else {
    console.log('Telefon numarası geçerli değil.');
  }

  const handleSelection2 = value => {
    setcinsiyet(value);
  };
  const handleSelection = value => {
    setKangrubu(value);
  };

  async function registerUser(
    email,
    phone,
    password,
    name,
    kangrubu,
    age,
    cinsiyet,
  ) {
    try {
      // Create a new user account in Firebase Authentication
      const {user} = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Store additional user information in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        email,
        phone,
        name,
        password,
        cinsiyet,
        kangrubu,
        age,
      });

      // Return the user object
      return user;
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.stretch}
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/epidis.png?alt=media&token=1120c793-ac77-4a86-9d4a-3dc1ea024073',
        }}
      />
      <View style={[styles.inputContainer2]}>
        <ScrollView style={[styles.scroll]} showsVerticalScrollIndicator={true}>
          <View style={[styles.inputContainer]}>
            <TextInput
              placeholder="Tam Adınız"
              placeholderTextColor={'#eee'}
              value={name}
              maxLength={25}
              onChangeText={text => setName(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Telefon Numaranız"
              placeholderTextColor="#eee"
              value={phone}
              maxLength={10}
              onChangeText={handlePhoneChange}
              style={styles.input}
              keyboardType="number-pad"
            />

            <TextInput
              placeholder="Yaşınız"
              placeholderTextColor="#eee"
              maxLength={2}
              value={age}
              onChangeText={text => {
                // Remove any non-digit characters from the input
                const numericValue = text.replace(/[^0-9]/g, '');

                // Check if the numeric value is within the desired range
                if (numericValue !== '') {
                  const numericAge = parseInt(numericValue);
                  if (numericAge >= 1 && numericAge <= 99) {
                    setAge(numericValue);
                  }
                } else {
                  setAge('');
                }
              }}
              style={styles.input}
              keyboardType="number-pad"
            />

            <View style={styles.HeaderContainer}>
              <Text style={styles.HeaderText}>Cinsiyetiniz</Text>
              <View style={styles.SelectableContainer}>
                <View style={styles.Selectable}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress,
                      cinsiyet === 'erkek' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection2('erkek')}>
                    <Text style={styles.PressText}>Erkek</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress,
                      cinsiyet === 'kadin' && {backgroundColor: '#B04759'},
                    ]}
                    onPress={() => handleSelection2('kadin')}>
                    <Text style={styles.PressText}>Kadın</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.HeaderContainer}>
              <Text style={styles.HeaderText}>Kan Grubunuz</Text>
              <View style={styles.SelectableContainer}>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'AB+' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('AB+')}>
                    <Text style={styles.PressText}>AB+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'AB-' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('AB-')}>
                    <Text style={styles.PressText}>AB-</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'A+' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('A+')}>
                    <Text style={styles.PressText}>A+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'A-' && {backgroundColor: '#B04759'},
                    ]}
                    onPress={() => handleSelection('A-')}>
                    <Text style={styles.PressText}>A-</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.SelectableContainer}>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'B+' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('B+')}>
                    <Text style={styles.PressText}>B+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === 'B-' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('B-')}>
                    <Text style={styles.PressText}>B-</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === '0+' && {backgroundColor: '#8294C4'},
                    ]}
                    onPress={() => handleSelection('0+')}>
                    <Text style={styles.PressText}>0+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.Selectable2}>
                  <TouchableOpacity
                    style={[
                      styles.SelectablePress2,
                      kangrubu === '0-' && {backgroundColor: '#B04759'},
                    ]}
                    onPress={() => handleSelection('0-')}>
                    <Text style={styles.PressText}>0-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            registerUser(email, phone, password, name, kangrubu, age, cinsiyet)
          }
          style={styles.button}>
          <Text style={styles.buttonText}>Onaylıyorum.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  SelectableContainer: {
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  HeaderText: {
    color: 'white',
    marginBottom: 15,
    width: '100%',
    marginLeft: '6%',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
  PressText: {
    color: 'white',
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'CaviarDreams',
  },
  Selectable: {
    width: '49%',
    alignItems: 'center',
  },
  SelectablePress: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Selectable2: {
    width: '24%',
    height: 40,
    alignItems: 'center',
  },
  SelectablePress2: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  scroll: {
    width: '100%',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0a2f35',
  },
  stretch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    alignContent: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer2: {
    width: '80%',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '70%',
  },
  input: {
    backgroundColor: '#0a2f35',
    color: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 15,
    borderColor: '#eee',
    width: '85%',
    justifyContent: 'center',
    alignContent: 'center',
    fontFamily: 'CaviarDreams',
    fontWeight: '600',
    fontSize: 16,
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
    padding: 15,
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
