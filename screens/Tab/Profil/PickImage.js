/* eslint-disable prettier/prettier */
/* eslint-disable curly */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {ref, uploadBytes, getDownloadURL, getStorage} from 'firebase/storage';
import {app} from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PickImage = () => {
  const [imgUrl, setImgUrl] = useState('');
  const [pickerResponse, setPickerResponse] = useState(null);
  const storage = getStorage(app);
  const onImageLibraryPress = useCallback(async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    try {
      const pickerResponse = await ImagePicker.launchImageLibrary(options);
      if (pickerResponse == null) return;

      const fileName = pickerResponse.assets[0].fileName;
      const imageRef = ref(storage, 'images/' + fileName + new Date());

      // Convert the image URI to a Blob object
      const response = await fetch(pickerResponse.assets[0].uri);
      const blob = await response.blob();

      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(imageRef, blob);
      console.log('Uploaded a blob or file!');

      const downloadURL = await getDownloadURL(imageRef);
      console.log('File available at', downloadURL);

      // Store the downloadURL in AsyncStorage
      await AsyncStorage.setItem('downloadURL', downloadURL);
      console.log('DownloadURL stored in AsyncStorage');

      // Update the state with the new downloadURL
      setImgUrl(downloadURL);
    } catch (error) {
      console.error('Error during image selection:', error);
    }
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Retrieve the downloadURL from AsyncStorage
        const downloadURL = await AsyncStorage.getItem('downloadURL');

        if (downloadURL) {
          // Use the retrieved downloadURL as needed
          console.log('Retrieved downloadURL:', downloadURL);

          // Update the state or perform any other actions with the downloadURL
          setImgUrl(downloadURL);
        } else {
          console.log('No downloadURL found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving downloadURL:', error);
      }
    };

    // Call the initializeApp function when the component mounts or when imgUrl changes
    initializeApp();
  }, [imgUrl]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {imgUrl ? (
        <View
          style={{
            width: 130,
            height: 130,
            position: 'relative',
            top: 0,
            zIndex: 1,
          }}>
          <ImageBackground
            source={{
              uri: imgUrl,
            }}
            style={{
              marginTop: 15,
              borderRadius: 50,
              width: 90,
              height: 90,
              borderWidth: 2,
              borderColor: 'white',
              overflow: 'hidden',
            }}
            imageStyle={{
              borderRadius: 5,
              width: 90,
              resizeMode: 'cover',
              height: 90,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0)',
              }}>
              {/* İçerik */}
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View
          style={{
            width: 130,
            height: 130,
            position: 'relative',
            top: 0,
            zIndex: 1,
          }}>
          <ImageBackground
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/219983.png?alt=media&token=c429a607-946d-4903-9955-1e56ea91ea4d',
            }}
            style={{
              marginTop: 15,
              borderRadius: 50,
              width: 90,
              height: 90,
              borderWidth: 2,
              borderColor: 'white',
              overflow: 'hidden',
            }}
            imageStyle={{
              borderRadius: 5,
              width: 90,
              resizeMode: 'cover',
              height: 90,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(80, 80, 80, 0.8)',
              }}>
              {/* İçerik */}
            </View>
          </ImageBackground>
        </View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#e56647',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: '#909090',
          borderRadius: 10,
        }}
        onPress={onImageLibraryPress}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'CaviarDreams',
          }}>
          Seç
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PickImage;
