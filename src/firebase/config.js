import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBYTBsLREXYuAkfyjK1weuGJ72MwCdczHE",
  authDomain: "olx-clone-1b2a1.firebaseapp.com",
  projectId: "olx-clone-1b2a1",
  storageBucket: "olx-clone-1b2a1.appspot.com",
  messagingSenderId: "787328249432",
  appId: "1:787328249432:web:f134565ec4ed7cea5a242d",
  measurementId: "G-MQFETMZSMB"
};

const firebase = initializeApp(firebaseConfig);
export default firebase;
export const db = getFirestore(firebase)
export const storage = getStorage(firebase)