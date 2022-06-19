// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_JgJNEb7uAMNDiJ1pTNj_PnY5pgiuuW0",
  authDomain: "dopa-music.firebaseapp.com",
  projectId: "dopa-music",
  storageBucket: "dopa-music.appspot.com",
  messagingSenderId: "480679810015",
  appId: "1:480679810015:web:53312cc01a71075fb92a6a",
  measurementId: "G-1NP8JSZCPV",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
