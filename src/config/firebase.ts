import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeAuth } from "firebase/auth";

// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXgYJIOaaGUvlxX4p_Z9zYzkboiPVD6Ho",
  authDomain: "farmaciadiazapp-848c9.firebaseapp.com",
  projectId: "farmaciadiazapp-848c9",
  storageBucket: "farmaciadiazapp-848c9.firebasestorage.app",
  messagingSenderId: "781290662907",
  appId: "1:781290662907:web:b64e4527ee3e366bb2795e",
  measurementId: "G-2BEQD6QHCZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
