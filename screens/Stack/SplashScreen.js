/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/splash.png')}
        resizeMode="contain"
        style={styles.image}
      />
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>1.0.0</Text>
      </View>
    </View>
  );
};

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
    fontSize: 18,
  },
});

export default SplashScreen;
