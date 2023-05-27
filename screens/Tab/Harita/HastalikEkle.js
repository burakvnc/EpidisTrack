/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FAB2 from './FAB2';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  GeoPoint,
  getDoc,
} from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAB3 from './FAB3';
import {getAuth} from 'firebase/auth';
import app from '../../../config';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
export default function HastalikEkle({navigation}) {
  const [location, setLocation] = useState({});
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        await Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            const geoPoint = new GeoPoint(latitude, longitude);
            setLocation(geoPoint);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  const db = getFirestore();
  const auth = getAuth(app);
  const [userData, setUserData] = useState([]);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [useruid, setUserUid] = useState('');
  const [password, setPassword] = useState('');
  const [kangrubu, setKangrubu] = useState('');
  const [cinsiyet, setcinsiyet] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [doktoragitme, setDoktoragitme] = useState(null);
  const [yakinindavarmi, setYakinindavarmi] = useState(null);
  const [siddet, setSiddet] = useState(null);
  const [hastalik, setHastalik] = useState(null);
  const [hastalikTanimi, setHastalikTanimi] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const handleSelection = value => {
    setDoktoragitme(value);
  };
  const handleSelection2 = value => {
    setYakinindavarmi(value);
  };
  const handleSelection3 = value => {
    setSiddet(value);
  };
  const handleSelectItem = item => {
    setHastalik(item.value); // Set the selected item's value in the 'hastalik' state
    setSelectedValue(item.value); // Set the selected item's value in a separate state
  };
  const handleHastalikTanimiChange = value => {
    setHastalikTanimi(value);
  };
  DropDownPicker.setListMode('FLATLIST');
  const [open4, setOpen4] = useState(false);
  const [value4, setValue4] = useState('');
  const [items4, setItems4] = useState([
    {label: 'Grip', value: 'grip'},
    {label: 'Nezle', value: 'nezle'},
    {label: 'Farenjit', value: 'farenjit'},
    {label: 'Sinüzit', value: 'sinüzit'},
    {label: 'İshal', value: 'ishal'},
    {label: 'Bulantı', value: 'bulanti'},
    {label: 'Ateş', value: 'ates'},
    {label: 'Karın Ağrısı', value: 'karin agrisi'},
    {label: 'Zehirlenme', value: 'zehirlenme'},
    {label: 'Soğuk Algınlığı', value: 'soguk alginligi'},
  ]);
  const valuesOnly = items4.map(item => item.value);
  const [isAllInputsFilled, setIsAllInputsFilled] = useState(false);
  const handleInputsValidation = () => {
    setIsAllInputsFilled(
      !!hastalikTanimi &&
        !!hastalik &&
        !!doktoragitme &&
        !!yakinindavarmi &&
        !!siddet,
    );
  };

  useEffect(() => {
    handleInputsValidation();
  }, [hastalikTanimi, doktoragitme, yakinindavarmi, siddet, hastalik]);

  useEffect(() => {
    let ageCategory = '';

    if (age >= 1 && age <= 29) {
      ageCategory = 'genc';
    } else if (age >= 30 && age <= 49) {
      ageCategory = 'orta yasli';
    } else if (age >= 50 && age <= 99) {
      ageCategory = 'yasli';
    }

    // ageCategory state'ini güncelle
    setAgeCategory(ageCategory);
  }, [age]);
  async function getIntroductions() {
    try {
      const uid = auth.currentUser.uid;
      setUserUid(uid);
      const userRef = doc(db, 'users', uid);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log('Retrieved user data:', userData);
        setUserData(userData);
        setPhone(userData.phone);
        setAge(userData.age);
        setcinsiyet(userData.cinsiyet);
        setEmail(userData.email);
        setKangrubu(userData.kangrubu);
        setName(userData.name);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.log('Error getting user document:', error);
    }
  }

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

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  console.log(formattedDate);
  const firestore = getFirestore();
  async function handlesubmitHastalik(
    name,
    age,
    kangrubu,
    cinsiyet,
    ageCategory,
    doktoragitme,
    yakinindavarmi,
    siddet,
    useruid,
    hastalikTanimi,
    formattedDate,
    location,
    selectedValue,
  ) {
    try {
      const userSubcollectionRef = collection(firestore, 'locations');

      // Store additional user information in the subcollection
      await addDoc(userSubcollectionRef, {
        name,
        age,
        kan: kangrubu,
        cinsiyet,
        yas: ageCategory,
        doktoragitme,
        yakinindavarmi,
        siddet,
        useruid,
        hastalikTanimi,
        formattedDate,
        location,
        hastalik: selectedValue,
      });
      alert('Hastalık Eklendi');
      navigation.navigate('Harita');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{backgroundColor: '#0a2f35', flex: 1}}>
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Hastalığınızı Tanımlayın.</Text>
          <TextInput
            placeholder="Hastalığın Tanımı"
            placeholderTextColor={'#eee'}
            style={styles.input}
            maxLength={100}
            value={hastalikTanimi}
            onChangeText={handleHastalikTanimiChange}
          />
        </View>
        <View style={styles.HeaderContainer2} nestedScrollEnabled={true}>
          <Text style={styles.HeaderText}>Hastalığınızın Kategorisi.</Text>
          <DropDownPicker
            open={open4}
            value={value4}
            textStyle={{
              fontFamily: 'CaviarDreams',
              fontSize: 15,
              color: '#eee',
            }}
            style={{
              backgroundColor: '#0a2f35',
              borderColor: '#eee',
              borderWidth: 2,
            }}
            items={items4}
            placeholder="Hastalığınızın Kategorisi"
            setOpen={setOpen4}
            setValue={setValue4}
            dropDownDirection="BOTTOM"
            setItems={setItems4}
            onSelectItem={handleSelectItem}
            listMode="MODAL"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            theme="DARK"
            modalProps={{statusBarTranslucent: true}}
            modalContentContainerStyle={{backgroundColor: '#0a2f35'}}
            dropDownContainerStyle={{
              backgroundColor: '#0a2f35',
              borderColor: '#eee',
            }}
          />
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Hastalığınızın Şiddeti.</Text>
          <View style={styles.SelectableContainer}>
            <View style={styles.Selectable2}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress2,
                  siddet === '1' && {backgroundColor: '#386641'},
                ]}
                onPress={() => handleSelection3('1')}>
                <Text style={styles.PressText}>1</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable2}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress2,
                  siddet === '2' && {backgroundColor: '#606c38'},
                ]}
                onPress={() => handleSelection3('2')}>
                <Text style={styles.PressText}>2</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable2}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress2,
                  siddet === '3' && {backgroundColor: '#fcbf49'},
                ]}
                onPress={() => handleSelection3('3')}>
                <Text style={styles.PressText}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable2}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress2,
                  siddet === '4' && {backgroundColor: '#bc6c25'},
                ]}
                onPress={() => handleSelection3('4')}>
                <Text style={styles.PressText}>4</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable2}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress2,
                  siddet === '5' && {backgroundColor: '#bc4749'},
                ]}
                onPress={() => handleSelection3('5')}>
                <Text style={styles.PressText}>5</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>
            Yakınınızda da aynı hastalık var mı?
          </Text>
          <View style={styles.SelectableContainer}>
            <View style={styles.Selectable}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress,
                  yakinindavarmi === 'evet' && {backgroundColor: '#8294C4'},
                ]}
                onPress={() => handleSelection2('evet')}>
                <Text style={styles.PressText}>Evet</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress,
                  yakinindavarmi === 'hayır' && {backgroundColor: '#B04759'},
                ]}
                onPress={() => handleSelection2('hayır')}>
                <Text style={styles.PressText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderText}>Doktora Gittiniz Mi?</Text>
          <View style={styles.SelectableContainer}>
            <View style={styles.Selectable}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress,
                  doktoragitme === 'evet' && {backgroundColor: '#8294C4'},
                ]}
                onPress={() => handleSelection('evet')}>
                <Text style={styles.PressText}>Evet</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Selectable}>
              <TouchableOpacity
                style={[
                  styles.SelectablePress,
                  doktoragitme === 'hayır' && {backgroundColor: '#B04759'},
                ]}
                onPress={() => handleSelection('hayır')}>
                <Text style={styles.PressText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <FAB2 onPress={() => navigation.navigate('Harita')} title="Geri Dön" />
      {isAllInputsFilled && (
        <FAB3
          onPress={() =>
            handlesubmitHastalik(
              name,
              age,
              kangrubu,
              cinsiyet,
              ageCategory,
              doktoragitme,
              yakinindavarmi,
              siddet,
              useruid,
              hastalikTanimi,
              formattedDate,
              location,
              selectedValue,
            )
          }
          title="Onayla"
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '85%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  HeaderContainer: {
    width: '100%',
    height: 100,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  HeaderContainer2: {
    width: '100%',
    height: 100,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    zIndex: 999,
  },

  SelectableContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  Selectable: {
    width: '49%',
    alignItems: 'center',
  },
  Selectable2: {
    width: '19%',
    alignItems: 'center',
  },
  SelectablePress: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectablePress2: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderText: {
    color: 'white',
    marginBottom: 15,
    width: '90%',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
  PressText: {
    color: 'white',
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'CaviarDreams',
  },
  input: {
    backgroundColor: '#0a2f35',
    color: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eee',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    fontFamily: 'CaviarDreams',
    fontWeight: '600',
    fontSize: 16,
    height: 50,
  },
});
