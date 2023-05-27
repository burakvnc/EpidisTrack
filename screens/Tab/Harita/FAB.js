/* eslint-disable prettier/prettier */
import {Pressable, StyleSheet, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
const FAB = props => {
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Lottie
        speed={0.5}
        progress={animationProgress.current}
        loop
        autoPlay
        source={require('../../../Props/lottie/add.json')}
        style={styles.icon}
      />
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    right: 10,
    backgroundColor: '#0a2f35',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 14,
    fontFamily:'CaviarDreams',
    color: '#fff',
  },
  icon: {
    height: 24,
    width: 24,
  },
});
