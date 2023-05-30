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
import React, {useState, useContext} from 'react';
import {SafeAreaView} from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import TermsAndConditions from './TermsAndConditions';
import MailSend from './MailSend';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SignInContext} from '../../../authContext';
export default function RegisterScreen({route, navigation}) {
  const {dispatchSignedIn} = useContext(SignInContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const auth = getAuth();
  const db = getFirestore();
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
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };
  const handleCheckboxChange2 = () => {
    setChecked2(!checked2);
  };
  const [bottomText, setBottomText] = useState(null);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Snackbar.show({
        text: 'Lütfen geçerli bir e-posta adresi girin.',
        duration: 2000,
      });
    }
  };
  const handleRegister = async () => {
    try {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail)\.[a-zA-Z]{2,}$/;

      if (email && password && checked && checked2) {
        try {
          const {user} = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
              navigation.navigate('CreateProfile', {
                email: email,
                password: password,
                user: user,
              });
            } else {
              dispatchSignedIn({
                type: 'UPDATE_SIGN_IN',
                payload: {userToken: 'signed-in'},
              });

              // Store the user token in AsyncStorage
              AsyncStorage.setItem('userToken', 'signed-in')
                .then(() => {
                  console.log('User token stored successfully.');
                })
                .catch(error => {
                  console.log('Error storing user token:', error);
                });
            }
          }
          console.log('Logged in with:', user.email);
        } catch (loginError) {
          // If login fails, create a new user account
          if (loginError.code === 'auth/user-not-found') {
            const {user} = await createUserWithEmailAndPassword(
              auth,
              email,
              password,
            );
            navigation.navigate('CreateProfile', {
              email: email,
              password: password,
              user: user,
            });
          } else {
            throw loginError; // Rethrow other login errors
          }
        }
      } else if (!emailRegex.test(email)) {
        Snackbar.show({
          text: 'Lütfen geçerli bir e-posta adresi girin.',
          duration: 2000,
        });
      } else if (!email) {
        Snackbar.show({
          text: 'Lütfen e-posta adresinizi girin.',
          duration: 2000,
        });
      } else if (!password) {
        Snackbar.show({
          text: 'Lütfen şifrenizi girin.',
          duration: 2000,
        });
      } else if (password.length <= 5) {
        Snackbar.show({
          text: 'Lütfen Geçerli bir şifre girin.En az 6 haneden oluşması gerekmektedir.',
          duration: 2000,
        });
      } else {
        Snackbar.show({
          text: 'Lütfen formları onaylayın.',
          duration: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.message;
      showSnackbar(errorMessage);
    }
  };

  const showSnackbar = message => {
    Snackbar.show({
      text: 'Bu Email Adresi Zaten kullanılıyor.',
      duration: 2000,
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
          onBlur={validateEmail}
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
        <View style={{flexDirection: 'row'}}>
          <CheckBox
            color={'#d90'}
            value={checked}
            onValueChange={handleCheckboxChange}
            tintColors={{true: '#e56647', false: '#eee'}}
          />
          <TermsAndConditions />
        </View>
        <View style={{flexDirection: 'row'}}>
          <CheckBox
            color={'#d90'}
            value={checked2}
            onValueChange={handleCheckboxChange2}
            tintColors={{true: '#e56647', false: '#eee'}}
          />
          <MailSend />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
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
    height: '15%',
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
    backgroundColor: '#0a2f35',
    color: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
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
