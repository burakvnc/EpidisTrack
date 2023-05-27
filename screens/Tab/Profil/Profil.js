/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import PickImage from './PickImage';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {onAuthStateChanged, getAuth, signOut} from 'firebase/auth';
import {isSupported, getAnalytics} from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {app} from '../../../config';
export default function Profil({navigation}) {
  const db = getFirestore();
  const auth = getAuth(app);
  const [userData, setUserData] = useState([]);
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kangrubu, setKangrubu] = useState('');
  const [cinsiyet, setcinsiyet] = useState('');
  async function getIntroductions() {
    try {
      const uid = auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log('Retrieved user data:', userData);
        setUserData(userData);
        setPhone(userData.phone);
        setAge(userData.age);
        setcinsiyet(userData.cinsiyet);
        setEmail(userData.email);
        setKangrubu(userData.kangrubu);
        setName(userData.name);
        setPassword(userData.password);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.log('Error getting user document:', error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        console.log(`The current user's UID is ${uid}`);
      } else {
        console.log('There is no currently signed in user');
      }
      const uid = currentUser.uid;
      if (uid) {
        await getIntroductions(uid);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(error => {
        // An error happened.
      });
  };

  return (
    <View style={{backgroundColor: '#0a2f35', flex: 1}}>
      <View style={styles.container}>
        <View style={styles.HeaderContainer2}>
          <Text style={styles.HeaderText}>Fotoğraf</Text>
          <PickImage />
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Email</Text>
          <TextInput
            placeholder="Email Adresiniz"
            value={email}
            placeholderTextColor={'#eee'}
            style={styles.input}
            maxLength={100}
            editable={false}
          />
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Şifre</Text>
          <TextInput
            placeholder="Şifreniz"
            value={password}
            placeholderTextColor={'#eee'}
            style={styles.input}
            maxLength={100}
            editable={false}
            secureTextEntry
          />
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Telefon Numarası</Text>
          <TextInput
            placeholder="Telefon Numaranız"
            placeholderTextColor={'#eee'}
            style={styles.input}
            value={phone}
            editable={false}
            maxLength={100}
          />
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>İsminiz</Text>
          <TextInput
            placeholder="İsminiz"
            placeholderTextColor={'#eee'}
            style={styles.input}
            value={name}
            editable={false}
            maxLength={100}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              height: 50,
              marginTop:15,
              backgroundColor: '#a44a3f',
              justifyContent: 'center',
              borderRadius: 15,
            }}
            onPress={handleSignOut} // Call the handleSignOut function onPress
          >
            <Text
              style={{
                justifyContent: 'center',
                fontFamily: 'CaviarDreams',
                paddingHorizontal: 10,
                paddingVertical: 3,
                fontSize: 16,
                color: '#eee',
              }}>
              Çıkış Yap
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '85%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  HeaderContainer: {
    width: '100%',
    height: 85,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  HeaderContainer2: {
    width: '100%',
    height: 140,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },

  Selectable: {
    width: '49%',
    alignItems: 'center',
  },
  Selectable2: {
    width: '19%',
    alignItems: 'center',
  },
  SelectablePress: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectablePress2: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderText: {
    color: 'white',
    marginBottom: 10,
    width: '90%',
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
  input: {
    backgroundColor: '#0a2f35',
    color: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eee',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    fontFamily: 'CaviarDreams',
    fontWeight: '600',
    fontSize: 16,
    height: 50,
  },
});
