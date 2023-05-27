/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */ /* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import TermsAndConditions from './TermsAndConditions';
import MailSend from './MailSend';

export default function RegisterScreen({route,navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();
  async function registerUser(email, phone, password, fullName) {
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
        fullName,
        password,
      });

      // Return the user object
      return user;
    } catch (error) {
      console.error(error);
    }
  }
  const handleLogin = () => {
    createUserWithEmailAndPassword(auth, email, password)
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
      <View>
        <TermsAndConditions />
        <MailSend />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateProfile', {
              email: email,
              password: password,
            })
          }
          style={styles.button}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
          style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.buttonOutlineText}>
              Zaten hesabınız var mı?{' '}
            </Text>
            <Text style={styles.buttonOutlineText2}>Giriş Yapın.</Text>
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
