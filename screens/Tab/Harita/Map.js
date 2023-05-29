/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import {View, StyleSheet, Text} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import {
  getFirestore,
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import {initializeApp} from 'firebase/app';
const CustomClusteredMarker = ({
  geometry,
  properties,
  onPress,
  clusterColor,
  clusterTextColor,
  clusterFontFamily,
  tracksViewChanges,
}) => {
  const size = 40;
  const width = size + 4;
  const height = size + 4;

  let viewToRender;

  if (properties.point_count === 0) {
    viewToRender = (
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: 'green',
            width,
            height,
            borderRadius: width / 2,
          },
        ]}
      />
    );
  } else if (properties.point_count <= 2) {
    viewToRender = (
      <View
        style={[
          styles.cluster,
          {
            backgroundColor: '#617143',
            borderWidth: 4,
            borderColor: '#61714364',
            width: size - 8,
            height: size - 8,
            borderRadius: size / 2,
          },
        ]}>
        <Text
          style={[
            styles.clusterText,
            {
              color: clusterTextColor,
              fontFamily: clusterFontFamily,
            },
          ]}>
          {properties.point_count}
        </Text>
      </View>
    );
  } else if (properties.point_count > 2 && properties.point_count <= 5) {
    viewToRender = (
      <View
        style={[
          styles.cluster,
          {
            backgroundColor: '#F7D060',
            borderWidth: 5,
            borderColor: '#F7D06064',
            width: size - 4,
            height: size - 4,
            borderRadius: size / 2,
          },
        ]}>
        <Text
          style={[
            styles.clusterText,
            {
              color: clusterTextColor,
              fontFamily: clusterFontFamily,
            },
          ]}>
          {properties.point_count}
        </Text>
      </View>
    );
  } else {
    viewToRender = (
      <View
        style={[
          styles.cluster,
          {
            backgroundColor: '#FF6D60',
            borderWidth: 6,
            borderColor: '#FF6D6064',
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}>
        <Text
          style={[
            styles.clusterText,
            {
              color: clusterTextColor,
              fontFamily: clusterFontFamily,
            },
          ]}>
          {properties.point_count}
        </Text>
      </View>
    );
  }

  return (
    <Marker
      coordinate={{
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}>
      {viewToRender}
    </Marker>
  );
};

export default function Map() {
  const mapStyle = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#0a2f35'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#515cdd'}],
    },
  ];

  const firebaseConfig = {
    apiKey: 'AIzaSyB6P5S-QDen3AckfsJ_iEDYG7hsHJe4p58',
    authDomain: 'epidis-d09dc.firebaseapp.com',
    databaseURL:
      'https://epidis-d09dc-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'epidis-d09dc',
    storageBucket: 'epidis-d09dc.appspot.com',
    messagingSenderId: '491490215048',
    appId: '1:491490215048:web:4a6980bc90b97d1ca90b3d',
    measurementId: 'G-G3S64CVTWC',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(['']);
  const [items, setItems] = useState([
    {label: 'Erkek', value: 'erkek'},
    {label: 'Kadın', value: 'kadın'},
  ]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(['']);
  const [items2, setItems2] = useState([
    {label: 'Genç', value: 'genc'},
    {label: 'Orta Yaşlı', value: 'orta yasli'},
    {label: 'Yaşlı', value: 'yasli'},
  ]);
  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState(['']);
  const [items3, setItems3] = useState([
    {label: 'AB+', value: 'AB+'},
    {label: 'AB-', value: 'AB-'},
    {label: 'A-', value: 'A-'},
    {label: 'A+', value: 'A+'},
    {label: 'B-', value: 'B-'},
    {label: 'B+', value: 'B+'},
    {label: '0+', value: '0+'},
    {label: '0-', value: '0-'},
  ]);
  const [open4, setOpen4] = useState(false);
  const [value4, setValue4] = useState(['']);
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
  const superClusterRef = useRef(null);

  const [markers, setMarkers] = useState();
  const [Query, setQuery] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [selectedIll, setSelectedIll] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [mapKey, setMapKey] = useState(Date.now().toString());

  const [lat2, setLat2] = useState(1);
  const [lng2, setLng2] = useState(2);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        await Geolocation.getCurrentPosition(
          position => {
            setLat2(position.coords.latitude);
            setLng2(position.coords.longitude);
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
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const db = getFirestore(app);
        const locationsCol = collection(db, 'locations');
        let q = query(locationsCol);

        if (
          selectedGender.length === 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length === 0 &&
          selectedAge.length === 0
        ) {
          q = query(locationsCol);
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length === 0 &&
          selectedAge.length === 0
        ) {
          q = query(locationsCol, where('cinsiyet', 'in', selectedGender));
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length === 0 &&
          selectedAge.length === 0
        ) {
          q = query(locationsCol, where('kan', 'in', selectedBlood));
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length === 0
        ) {
          q = query(locationsCol, where('hastalik', 'in', selectedIll));
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length === 0 &&
          selectedAge.length !== 0
        ) {
          q = query(locationsCol, where('yas', 'in', selectedAge));
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length === 0 &&
          selectedAge.length === 0
        ) {
          q = query(
            locationsCol,
            where('cinsiyet', 'in', selectedGender),
            where('kan', 'in', selectedBlood),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length === 0
        ) {
          q = query(
            locationsCol,
            where('cinsiyet', 'in', selectedGender),
            where('hastalik', 'in', selectedIll),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length === 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('cinsiyet', 'in', selectedGender),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length === 0
        ) {
          q = query(
            locationsCol,
            where('kan', 'in', selectedBlood),
            where('hastalik', 'in', selectedIll),
          );
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length === 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('kan', 'in', selectedBlood),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('hastalik', 'in', selectedIll),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length === 0
        ) {
          q = query(
            locationsCol,
            where('hastalik', 'in', selectedIll),
            where('cinsiyet', 'in', selectedGender),
            where('kan', 'in', selectedBlood),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length === 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('kan', 'in', selectedBlood),
            where('cinsiyet', 'in', selectedGender),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length === 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('hastalik', 'in', selectedIll),
            where('kan', 'in', selectedBlood),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length === 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('hastalik', 'in', selectedIll),
            where('cinsiyet', 'in', selectedGender),
            where('yas', 'in', selectedAge),
          );
        } else if (
          selectedGender.length !== 0 &&
          selectedBlood.length !== 0 &&
          selectedIll.length !== 0 &&
          selectedAge.length !== 0
        ) {
          q = query(
            locationsCol,
            where('hastalik', 'in', selectedIll),
            where('cinsiyet', 'in', selectedGender),
            where('kan', 'in', selectedBlood),
            where('yas', 'in', selectedAge),
          );
        }

        const querySnapshot = await getDocs(q);
        const markerData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const location = data.location;
          const latitude = location.latitude;
          const longitude = location.longitude;
          return {latitude, longitude};
        });
        setMarkers(markerData);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    fetchMarkers();
  }, [selectedAge, selectedBlood, selectedGender, selectedIll]);

  const handleGenderChange = selectedValues => {
    if (selectedValues.includes('erkek') && selectedValues.includes('kadın')) {
      setSelectedGender([]);
    } else {
      setSelectedGender(selectedValues);
    }
  };
  const handleIllChange = selectedValues => {
    if (
      selectedValues.includes('grip') &&
      selectedValues.includes('nezle') &&
      selectedValues.includes('farenjit') &&
      selectedValues.includes('sinüzit') &&
      selectedValues.includes('bronşit') &&
      selectedValues.includes('ishal') &&
      selectedValues.includes('bulanti') &&
      selectedValues.includes('ates') &&
      selectedValues.includes('karin agrisi') &&
      selectedValues.includes('zehirlenme') &&
      selectedValues.includes('soguk alginligi')
    ) {
      setSelectedIll([]);
    } else {
      setSelectedIll(selectedValues);
    }
  };
  const handleBloodChange = selectedValues => {
    if (
      selectedValues.includes('AB-') &&
      selectedValues.includes('AB+') &&
      selectedValues.includes('A+') &&
      selectedValues.includes('A-') &&
      selectedValues.includes('B+') &&
      selectedValues.includes('B-') &&
      selectedValues.includes('0+') &&
      selectedValues.includes('0-')
    ) {
      setSelectedBlood([]);
    } else {
      setSelectedBlood(selectedValues);
    }
  };
  const handleAgeChange = selectedValues => {
    if (
      selectedValues.includes('genc') &&
      selectedValues.includes('orta') &&
      selectedValues.includes('yasli')
    ) {
      setSelectedAge([]);
    } else {
      setSelectedAge(selectedValues);
    }
  };
  const getClusterColor = cluster => {
    const density = cluster.point_count;
    if (density < 2) {
      return 'green';
    } else if (density >= 2) {
      return 'red';
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: '12%',
          flexDirection: 'row',
          zIndex: 999,
        }}>
        <View style={{width: '25%', alignSelf: 'flex-end'}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'CaviarDreams',
              }}>
              Cinsiyet
            </Text>
          </View>
          <DropDownPicker
            open={open}
            value={value}
            style={{backgroundColor: '#0a2f35', borderColor: '#0a2f35'}}
            items={items}
            placeholder="Cinsiyet"
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            theme="DARK"
            multiple={true}
            dropDownDirection="BOTTOM"
            badgeDotStyle={{width: 0, height: 0}}
            textStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            dropDownContainerStyle={{
              backgroundColor: '#0a2f35',
              borderColor: '#0a2f35',
            }}
            onSelectItem={selectedValues => {
              handleGenderChange(selectedValues.map(item => item.value));
              console.log(selectedGender);
            }}
            mode="BADGE"
            badgeStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            badgeColors={['#0a2f35', '#0a2f35']}
            badgeTextStyle={{color: 'white'}}
            badgeDotColors={['blue', 'pink']}
          />
        </View>
        <View style={{width: '25%', alignSelf: 'flex-end'}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'CaviarDreams',
              }}>
              Yaş Grubu
            </Text>
          </View>
          <DropDownPicker
            open={open2}
            value={value2}
            textStyle={{fontFamily: 'CaviarDreams', fontSize: 10}}
            style={{backgroundColor: '#0a2f35', borderColor: '#0a2f35'}}
            items={items2}
            placeholder="Yaş Grubu"
            setOpen={setOpen2}
            setValue={setValue2}
            setItems={setItems2}
            theme="DARK"
            multiple={true}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={{
              backgroundColor: '#0a2f35',
              borderColor: '#0a2f35',
            }}
            onSelectItem={selectedValues => {
              handleAgeChange(selectedValues.map(item => item.value));
              console.log(selectedAge);
            }}
            mode="BADGE"
            badgeDotStyle={{width: 0, height: 0}}
            badgeStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            badgeColors={['#0a2f35', '#0a2f35']}
            badgeTextStyle={{color: 'white'}}
            badgeDotColors={['blue', 'pink']}
          />
        </View>
        <View style={{width: '25%', alignSelf: 'flex-end'}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'CaviarDreams',
              }}>
              Kan Grubu
            </Text>
          </View>
          <DropDownPicker
            open={open3}
            value={value3}
            textStyle={{fontFamily: 'CaviarDreams', fontSize: 10}}
            style={{backgroundColor: '#0a2f35', borderColor: '#0a2f35'}}
            items={items3}
            placeholder="Kan Grubu"
            setOpen={setOpen3}
            setValue={setValue3}
            setItems={setItems3}
            theme="DARK"
            multiple={true}
            maxHeight={'800%'}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={{
              backgroundColor: '#0a2f35',
              borderColor: 'transparent',
            }}
            onSelectItem={selectedValues => {
              handleBloodChange(selectedValues.map(item => item.value));
              console.log(selectedBlood);
            }}
            mode="BADGE"
            badgeDotStyle={{width: 0, height: 0}}
            badgeStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            badgeColors={[
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
              '#0a2f35',
            ]}
            badgeTextStyle={{color: 'white'}}
            badgeDotColors={[
              'blue',
              'pink',
              'red',
              'gray',
              'yellow',
              'orange',
              'purple',
              'cyan',
            ]}
          />
        </View>
        <View style={{width: '25%', alignSelf: 'flex-end'}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'CaviarDreams',
              }}>
              Hastalık
            </Text>
          </View>
          <DropDownPicker
            open={open4}
            value={value4}
            textStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            style={{backgroundColor: '#0a2f35', borderColor: '#0a2f35'}}
            items={items4}
            placeholder="Hastalık"
            setOpen={setOpen4}
            setValue={setValue4}
            maxHeight={'800%'}
            dropDownDirection="BOTTOM"
            setItems={setItems4}
            theme="DARK"
            multiple={true}
            dropDownContainerStyle={{
              backgroundColor: '#0a2f35',
              borderColor: '#0a2f35',
            }}
            onSelectItem={selectedValues => {
              handleIllChange(selectedValues.map(item => item.value));
              console.log(selectedIll);
            }}
            mode="BADGE"
            badgeDotStyle={{width: 0, height: 0}}
            badgeStyle={{fontFamily: 'CaviarDreams', fontSize: 12}}
            badgeColors={['#0a2f35', '#0a2f35']}
            badgeTextStyle={{color: 'white'}}
            badgeDotColors={[
              'blue',
              'pink',
              'red',
              'gray',
              'yellow',
              'orange',
              'purple',
              'cyan',
            ]}
          />
        </View>
      </View>
      <View style={{width: '100%', height: '88%'}}>
        {lat2 !== 1 && lng2 !== 2 && (
          <MapView
            provider={PROVIDER_GOOGLE}
            userInterfaceStyle={'dark'}
            toolbarEnabled={false}
            minZoomLevel={2}
            maxZoomLevel={12}
            style={styles.map}
            customMapStyle={mapStyle}
            key={mapKey}
            initialRegion={{
              latitude: lat2,
              longitude: lng2,
              latitudeDelta: 8,
              longitudeDelta: 8,
            }}
            clusteringEnabled={true}
            onClusterPress={cluster => console.log(cluster)}
            renderCluster={cluster => {
              const clusterColor = getClusterColor(cluster);
              return (
                <CustomClusteredMarker
                  key={cluster.properties.cluster_id}
                  {...cluster}
                  clusterColor={clusterColor}
                  clusterTextColor="#FFF"
                  clusterFontFamily="Arial"
                  tracksViewChanges={true}
                />
              );
            }}
            onMapReady={() => {
              if (superClusterRef.current) {
                superClusterRef.current.getClusters();
              }
            }}
            ref={ref => {
              if (ref) {
                superClusterRef.current = ref.getClusteringEngine();
              }
            }}>
            {markers &&
              markers.map((marker, index) => (
                <Marker
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  image={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/epidis-d09dc.appspot.com/o/dot33.png?alt=media&token=3200b9d0-e04b-46b2-853a-7ba3a5fb503f',
                  }}
                  key={index}
                />
              ))}
          </MapView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    zIndex: 98,
  },
  cluster: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  wrapper: {
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
