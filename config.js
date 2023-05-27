/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics, isSupported} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));
