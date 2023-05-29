/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import StackNavigator from './screens/StackNavigator';
import {LogBox, Image} from 'react-native';
import {useEffect, useState, useContext} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TabNavigator from './screens/TabNavigator';
import {app} from './config';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SignInContextProvider} from './authContext';
import RootNavigator from './screens/rootNavigation';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App() {
  const [splashScreenVisible, setSplashScreenVisible] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setInitializing(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      // Hides native splash screen after 2s
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSplashScreenVisible(false);
    }

    async function checkUserPersistence() {
      try {
        const persistedUser = await AsyncStorage.getItem('user');
        setUser(persistedUser ? JSON.parse(persistedUser) : null);
      } catch (error) {
        console.error('Failed to retrieve persisted user:', error);
      } finally {
        setInitializing(false);
        hideSplashScreen();
      }
    }

    if (initializing) {
      checkUserPersistence();
    }
  }, []);
  console.log(user);
  useEffect(() => {
    async function persistUser() {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to persist user:', error);
      }
    }

    persistUser();
  }, [user]);

  if (splashScreenVisible) {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/splash.png?alt=media&token=0f8d5227-d2dc-42e3-843b-500fb820a490',
          }}
          resizeMode="contain"
          style={styles.image}
        />
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>
    );
  } else {
    return (
      <>
        <SignInContextProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <StatusBar hidden={true} />
            <RootNavigator />
          </GestureHandlerRootView>
        </SignInContextProvider>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
  },
  versionText: {
    color: '#fff',
    fontSize: 12,
  },
});
