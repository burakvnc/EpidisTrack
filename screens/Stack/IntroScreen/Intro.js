/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {isSupported, getAnalytics} from 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/firestore';
import config from '../../../config';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default function Intro({navigation}) {
  const [bbg2, setBbg2] = useState('');

  if (isSupported()) {
    const analytics = getAnalytics();
    // initialize Firebase Analytics here
  } else {
    console.log('Firebase Analytics is not supported in this environment');
  }
  const db = getFirestore();
  const [slide, setSlide] = useState([]);

  async function getIntroductions() {
    try {
      const collectionRef = collection(db, 'intro');
      const querySnapshot = await getDocs(collectionRef);
      const slideData = querySnapshot.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });
      setSlide(slideData);
    } catch (error) {
      console.log('Error getting documents:', error);
    }
  }

  useEffect(() => {
    getIntroductions();
  }, []);
  const [bg, setBg] = useState('');
  const [bbg, setBbg] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const RenderItem = ({item, index, length}) => {
    return (
      <View style={[styles.slide]}>
        <Image style={styles.introImageStyle} source={{uri: item.image}} />
        <Text style={styles.introTextStyle}>{item.text}</Text>
      </View>
    );
  };

  const PaginationDots = ({data, activeIndex, onPressDot}) => {
    switch (activeIndex) {
      case 0:
        backgroundColor = '#073B3A';
        setBg(backgroundColor);
        color = '#92374D';
        setBbg(color);
        color2 = '#435391';
        setBbg2(color2);
        break;
      case 1:
        backgroundColor = '#92374D';
        setBg(backgroundColor);
        color = '#19A7CE';
        setBbg(color);
        color2 = '#92374D';
        setBbg2(color2);
        break;
      case 2:
        backgroundColor = '#19A7CE';
        setBg(backgroundColor);
        color = '#073B3A';
        setBbg(color);
        color2 = '#073B3A';
        setBbg2(color2);
        break;
      default:
        backgroundColor = 'white';
    }

    return (
      <View style={styles.paginationContainer}>
        {slide.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.activeDot,
            ]}
            onPress={() => onPressDot(index)}
          />
        ))}
      </View>
    );
  };
  const [dotScale] = useState(new Animated.Value(1));
  const [dotPosition] = useState(new Animated.Value(activeIndex));
  const handleDotPress = index => {
    setActiveIndex(index);
    Animated.timing(dotPosition, {
      toValue: index,
      duration: 300, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };

  const scrollViewRef = useRef(null);

  const handleScroll = event => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(xOffset / width);
    setActiveIndex(currentIndex);
    const index = Math.floor(xOffset / width);
    const maxScrollX = index * width;
    const minScrollX = 1;

    if (xOffset > maxScrollX && xOffset < minScrollX) {
      scrollViewRef.current.scrollToOffset({
        offset: maxScrollX,
        animated: true,
      });
    }
  };

  const renderItem = ({item, index}) => {
    return <RenderItem item={item} index={index} length={slide.length} />;
  };

  const styles = StyleSheet.create({
    introImageStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      width: 250,
      height: 250,
      marginTop: 20,
      resizeMode: 'contain',
    },
    introTextStyle: {
      fontSize: 24,
      fontFamily: 'CaviarDreams',
      color: 'white',
      justifyContent: 'flex-start',
      textAlign: 'center',
      alignItems: 'center',
      alignContent: 'center',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    slide: {
      width: width,
      height: height / 2 + 50,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    button: {
      backgroundColor: bbg,
      alignSelf: 'center',
      width: '30%',
      height: 40,
      marginBottom: 25,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#efefee54',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button2: {
      backgroundColor: bbg2,
      alignSelf: 'center',
      width: '60%',
      height: 50,
      marginBottom: 25,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#efefee54',
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 18,
      fontFamily: 'CaviarDreams',
    },
    paginationContainer: {
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
      backgroundColor: '#909090',
    },

    activeDot: {
      backgroundColor: '#565656',
      width: 30,
      height: 10,
    },
  });
  return (
    <View style={{flex: 1, backgroundColor: bg}}>
      <FlatList
        data={slide}
        ref={scrollViewRef}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      <PaginationDots
        data={slide}
        activeIndex={activeIndex}
        onPressDot={handleDotPress}
        dotStyle={[
          styles.dot,
          {
            transform: [
              {
                translateX: dotPosition.interpolate({
                  inputRange: [0, slide.length],
                  outputRange: [-10, (slide.length - 1) * 20],
                }),
              },
            ],
          },
        ]}
        activeDotStyle={[
          styles.activeDot,
          {
            transform: [
              {
                translateX: dotPosition.interpolate({
                  inputRange: [0, slide.length],
                  outputRange: [-10, (slide.length - 1) * 20],
                }),
              },
              {
                scale: dotPosition.interpolate({
                  inputRange: [0, slide.length],
                  outputRange: [1, 1.5],
                }),
              },
            ],
          },
        ]}
      />

      <View
        style={{
          height: height / 2 - 55,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <TouchableHighlight
          onPress={() => navigation.navigate('LoginScreen')}
          style={styles.button}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={styles.buttonText}>Atla</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}
