import { initializeApp } from '@firebase/app';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBj_XKzOGc42BcoMTjB4BFQ_8SakgexoQE",
  authDomain: "dcs-app-a660d.firebaseapp.com",
  projectId: "dcs-app-a660d",
  storageBucket: "dcs-app-a660d.appspot.com",
  messagingSenderId: "475298723109",
  appId: "1:475298723109:web:b6d63d24b10371bc2a56cc",
  measurementId: "G-ER1Q1L5WVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export {auth};