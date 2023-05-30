/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useContext, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Animated, Easing} from 'react-native';
import app from '../../../config';
import {
  collection,
  query,
  where,
  deleteDoc,
  getDocs,
  getFirestore,
  doc,
} from 'firebase/firestore';
import {
  deleteUser,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import {SignInContext} from '../../../authContext';
export default function Ayarlar() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const {dispatchSignedIn} = useContext(SignInContext);
  const [uid, setUid] = useState('');
  const [hata, setHata] = useState(false);
  const [email, setEmail] = useState('');
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          const uidValue = parsedUser.uid;
          console.log('UID from AsyncStorage:', uidValue);
          setUid(uidValue);
          setEmail(parsedUser.email);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserFromStorage();
  }, []);
  // Call getIntroductions with the UID value from AsyncStorage
  const handledeleteAccount = async () => {
    const userUid = uid; // Replace with the actual user UID

    try {
      // Re-authenticate the user with the password
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Account re-authenticated successfully
      console.log('Account re-authenticated successfully');

      // Delete the user account
      await deleteUser(auth.currentUser);

      // Account deleted successfully
      console.log('Account deleted successfully');

      // Delete user data from "users" table
      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('uid', '==', userUid));
      const userSnapshot = await getDocs(userQuery);

      userSnapshot.forEach(async userDoc => {
        await deleteDoc(doc(usersCollectionRef, userUid));
      });

      // Delete user data from "locations" table
      const locationsCollectionRef = collection(db, 'locations');
      const locationsQuery = query(
        locationsCollectionRef,
        where('useruid', '==', userUid),
      );
      const locationsSnapshot = await getDocs(locationsQuery);

      locationsSnapshot.forEach(async locationDoc => {
        await deleteDoc(doc(locationsCollectionRef, locationDoc.id));
      });

      dispatchSignedIn({
        type: 'UPDATE_SIGN_IN',
        payload: {userToken: 'signed-out'},
      });

      // Update user token to signed-out
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
    } catch (error) {
      // An error occurred while re-authenticating or deleting the account
      console.error('Error deleting account:', error);
      setHata(true);
    }
  };

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);
  const [password, setPassword] = useState('');
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClose = () => {
    setIsModalVisible(false);
    setPassword('');
    setHata(false);
    console.log('OK pressed');
  };
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Hesabınızı Silmek İçin Hesap Şifrenizi Giriniz.
            </Text>
            <TextInput
              placeholder="Şifreniz"
              placeholderTextColor={'#eee'}
              style={[
                styles.input,
                {borderColor: hata ? 'red' : '#eee'},
              ]}
              maxLength={100}
              value={password}
              secureTextEntry
              onChangeText={text => {
                setPassword(text);
                setHata(false);
              }}
            />
            {hata && <Text style={styles.errorText}>Şifre Hatalı</Text>}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                marginTop: 15,
                width: '80%',
              }}>
              <TouchableOpacity
                onPress={handledeleteAccount}
                style={styles.button}>
                <Text style={styles.buttonText}>Onayla</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={styles.button2}>
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{backgroundColor: '#0a2f35', flex: 1}}>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
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
                height: 60,
                alignItems: 'center',
                alignContent: 'center',
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
                  height: '100%',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#eee',
                    fontFamily: 'CaviarDreams',
                    fontSize: 12,
                  }}>
                  Bu uygulama bir Salgın Takip Uygulamasıdır. Uygulamada önemli
                  amaç hastaların bilgilerini doğru şekilde girmesini sağlamak
                  ve yaşanacak salgınların önüne geçmektir.
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: 190,
    backgroundColor: '#374259',
    borderRadius: 5,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#ffffff54',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2,
    elevation: 10,
  },
  modalText: {
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    position: 'absolute',
    top:'75%',
    color: '#CD1818',
    textAlign: 'center',
  },
  button: {
    borderRadius: 5,
    width: 75,
    padding: 10,
    elevation: 2,
    alignContent: 'flex-start',
    backgroundColor: '#CD1818',
  },
  button2: {
    borderRadius: 5,
    width: 75,
    padding: 10,
    elevation: 2,
    alignContent: 'flex-end',
    backgroundColor: '#5C8984',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#374259',
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
    height: 40,
  },
});
