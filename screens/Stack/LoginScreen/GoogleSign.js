/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableHighlight,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function GoogleSign() {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '491490215048-fmrser4097ksuvnfum2vqa1lerlunoas.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  });

  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo2, setuserInfo] = useState([]);
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setuserInfo(userInfo);
      console.log(userInfo2);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
      } else {
        // some other error happened
      }
    }
  };
  return (
    <>
      <View style={styles.body}>
        <TouchableHighlight onPress={signIn}>
          <Image
            style={styles.stretch}
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/signin-button.png?alt=media&token=ea3d1211-2ef2-4aaa-b8e9-aae66d20a851',
            }}
          />
        </TouchableHighlight>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  body: {
    width: '100%',
    marginTop: 25,
  },
  stretch: {
    width: '100%',
    resizeMode: 'cover',
    height: 50,
    borderRadius: 10,
  },
});
