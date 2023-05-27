/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  getFirestore,
  where,
  query,
  getDocs,
  collection,
} from 'firebase/firestore';
import app from '../../../config';
import {getAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

export default function Gecmis() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [data, setData] = useState(null);
  async function getIntroductions() {
    try {
      const uid = auth.currentUser.uid;
      const q = query(collection(db, 'locations'), where('useruid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDataArray = [];
        querySnapshot.forEach(docSnapshot => {
          const userData = docSnapshot.data();
          userDataArray.push(userData);
        });
        setData(userDataArray);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.log('Error getting user document:', error);
    }
  }

  useEffect(() => {
    getIntroductions();
  }, []);

  console.log(data);

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = () => {
    setIsRefreshing(true);
    getIntroductions()
      .then(() => setIsRefreshing(false))
      .catch(error => {
        console.log('Error refreshing data:', error);
        setIsRefreshing(false);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      getIntroductions();
    }, []),
  );
  const renderUserData = ({item}) => {
    function getSiddetColor() {
      // Define your logic to map the siddet value to a background color
      // For example:
      if (item.siddet === '1') {
        return '#386641';
      } else if (item.siddet === '2') {
        return '#606c38';
      } else if (item.siddet === '3') {
        return '#fcbf49';
      } else if (item.siddet === '4') {
        return '#bc6c25';
      } else if (item.siddet === '5') {
        return '#bc4749';
      }
      // Add more conditions as needed
      // If no match is found, return a default color
      return '#000000';
    }
    function getdoktorcolor() {
      // Define your logic to map the siddet value to a background color
      // For example:
      if (item.doktoragitme === 'evet') {
        return '#386641';
      } else if (item.doktoragitme === 'hayır') {
        return '#B04759';
      }
      // Add more conditions as needed
      // If no match is found, return a default color
      return '#000000';
    }
    return (
      <View
        style={{
          backgroundColor: '#70a09b',
          width: '100%',
          height: 300,
          borderRadius: 10,
          marginBottom: 20,
        }}>
        <View>
          <View
            style={{
              backgroundColor: '#eee',
              alignSelf: 'center',
              width: '95%',
              marginTop: '2%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              height: 40,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-start',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingRight: 4,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Hastalık Adı:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: '#bc6c25',
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: 'CaviarDreams',
                    color: '#eee',
                  }}>
                  {item.hastalik}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingRight: 4,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Kan Grubunuz:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: '#717744',
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: 'CaviarDreams',
                    color: '#eee',
                  }}>
                  {item.kan}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#eee',
              alignSelf: 'center',
              width: '95%',
              marginTop: '2%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              height: 40,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-start',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingRight: 4,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Hastalık Tarihi:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: '#006d77',
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: 'CaviarDreams',
                    color: '#eee',
                  }}>
                  {item.formattedDate}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Hastalık Şiddeti:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: getSiddetColor(item.siddet),
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    color: '#eee',
                  }}>
                  {item.siddet}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#eee',
              alignSelf: 'center',
              width: '95%',
              marginTop: '2%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              height: 40,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-start',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Yaşınız
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: '#2f6690',
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    color: '#eee',
                  }}>
                  {item.age}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '47%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Doktora Gittiniz Mi?:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: getdoktorcolor(item.doktoragitme),
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: 13,
                    textAlign: 'center',
                    color: '#eee',
                  }}>
                  {item.doktoragitme}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#eee',
              alignSelf: 'center',
              width: '95%',
              marginTop: '2%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              height: 80,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '94%',
              }}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontFamily: 'CaviarDreams',
                  paddingRight: 4,
                  paddingVertical: 3,
                  fontSize: 13,
                  color: '#0a2f35',
                }}>
                Hastalık Açıklaması:
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  width: '100%',
                  paddingVertical: 3,
                  backgroundColor: '#7d4f50',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: 'CaviarDreams',
                    color: '#eee',
                  }}>
                  {item.hastalikTanimi}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            width: '95%',
            marginTop: '5%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            height: 40,
            borderRadius: 10,
          }}>
          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: '#a44a3f',
              justifyContent: 'center',
              borderRadius: 15,
            }}>
            <Text
              style={{
                justifyContent: 'center',
                fontFamily: 'CaviarDreams',
                paddingHorizontal: 10,
                paddingVertical: 3,
                fontSize: 16,
                color: '#eee',
              }}>
              Hastalığı Atlattım ve Silmek İstiyorum.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#0a2f35',
        flex: 1,
        alignItems: 'center',
      }}>
      {data ? (
        <FlatList
          data={data}
          renderItem={renderUserData}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={{marginTop: 15}}>Hiç Hastalık Eklememişsiniz...</Text>
      )}
    </View>
  );
}
