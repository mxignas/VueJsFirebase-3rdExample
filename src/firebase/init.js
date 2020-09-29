import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD0G6oHDaamf3YmQIGmHXSvR72O6NJXaac",
    authDomain: "udemygeoninjas.firebaseapp.com",
    databaseURL: "https://udemygeoninjas.firebaseio.com",
    projectId: "udemygeoninjas",
    storageBucket: "udemygeoninjas.appspot.com",
    messagingSenderId: "835566501058",
    appId: "1:835566501058:web:d52e9d088753a668248f5b",
    measurementId: "G-Q0EHVR3FCB"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebaseApp.firestore()