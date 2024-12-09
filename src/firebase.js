// firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiyjSIr-L9jiVmhRFsJAUTd1fouV7DaGo",
  authDomain: "doan-12f31.firebaseapp.com",
  projectId: "doan-12f31",
  storageBucket: "doan-12f31.appspot.com",
  messagingSenderId: "24882177310",
  appId: "1:24882177310:web:4be292aae16c50a767150f",
  measurementId: "G-P43XJ6X35L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };
