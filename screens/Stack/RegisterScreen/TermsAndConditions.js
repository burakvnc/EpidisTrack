/* eslint-disable react-native/no-inline-styles */ /* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import ScrollViewIndicator from 'react-native-scroll-indicator';
import CheckBox from '@react-native-community/checkbox';
const TermsAndConditions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    setModalVisible(false);
  };

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <CheckBox
          color={'#d90'}
          value={checked}
          onValueChange={handleCheckboxChange}
          tintColors={{ true: '#e56647', false: '#eee' }}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: 'CaviarDreams',
              marginTop:8,
              fontWeight:'600',
              color: '#d90',
              textDecorationLine: 'underline',
            }}>
            KVKK ve Açık İzin
          </Text>
        </TouchableOpacity>
        <Text style={{fontFamily: 'CaviarDreams',color:'#fff',marginTop:8}}> formunu onaylıyorum.</Text>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        statusBarTranslucent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#181818',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#f9f9f9',
              fontSize: 12.5,
              marginVertical: 20,
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ
          </Text>
          <ScrollViewIndicator
            style={{marginBottom: 50}}
            scrollIndicatorContainerStyle={{
              backgroundColor: '#909090',
              width: 2,
            }}
            scrollIndicatorStyle={{backgroundColor: '#000'}}>
            <Text style={{marginHorizontal: 40, color: '#909090'}}>
              <Text style={{fontWeight: 'bold', color: '#f9f9f9'}}>
                KVKK ONAY METNİ
              </Text>
              {`
              
Kişisel veri işlemenin temel şartı ilgili kişinin rızasıdır.Kanunda belirtilen istisnai durumlarda ise ilgili kişinin açıkrızası aranmaksızın kişisel verilerinin işlenmesi mümkündür.Bu durumlar KVKK madde 5/2 ve madde 6/3’te belirtilmiştir.

İstisnai hallerden yararlanıldığı durumlarda veri sorumlusunun yapması gereken diğer yükümlülükler ortadan kalkmamakta, yapılması gereken yükümlülükler yapılmaya devam edilmelidir. Veri işleme faaliyetinden önce yapılması gereken aydınlatma yükümlülüğü, bu yükümlülüklerin ilkidir. 

`}
              <Text style={{fontWeight: 'bold', color: '#f9f9f9'}}>
                AÇIK RIZA
              </Text>
              {`

Açık rıza metni, kanuni yapısı gereği ayrı şekilde alınması gereken, faaliyet özelinde, hizmet şartına bağlanmaksızın alınması gereken bir metindir. Aydınlatma metni ve açık rızanın bir arada bulunduğu, ifadelerin muğlak şekilde belirtildiği, hizmet şartına bağlandığı açık rıza metinleri geçerli olmayacaktır. 

Veri sorumlusu açık rıza alırken, aydınlatma yaparken uyması gereken bir şekil şartı yoktur ancak ispat yükümlülüğü veri sorumlusundadır. Teknolojiden yararlanarak bu yükümlülükleri SMS, Mail göndermek suretiyle, yazılı ortamda ıslak imzalı şekilde veya sözlü olarak gerçekleştirebilmektedir. Unutulmaması gereken husus, açık rıza beyanının aydınlatma metninden ayrı şekilde alınması gerektiği ve kanuni tanımına uygun şekilde alınması gerektiğidir. 

`}
              <Text style={{fontWeight: 'bold', color: '#f9f9f9'}}>
                ONAY SİSTEMİ
              </Text>
              {`

Kişisel Verilerin Korunması kapsamında alınacak onay ve rızalar için kağıt ve ıslak imzaya gerek duymayan, KVKK'nın tüm gerekliliklerini içinde barındıran bu sistem ve uygulama örnekleri çok yakında bu sayfadan yayınlacaktır.

`}
            </Text>
          </ScrollViewIndicator>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              bottom: 25,
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#d90',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
                marginTop: 20,
              }}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsAndConditions;
