import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQUYPAgc2nbZkYZY3Xm8bIGj4FBfhIa4s",
  authDomain: "social1-41d35.firebaseapp.com",
  projectId: "social1-41d35",
  databaseURL: "http://social1-41d35.firebaseio.com",
  storageBucket: "social1-41d35.appspot.com",
  messagingSenderId: "982756828990",
  appId: "1:982756828990:web:89f01ed16569692b8dee6f",
};

const Firebase = firebase.initializeApp(firebaseConfig);
const firebasetime = firebase.firestore.FieldValue.serverTimestamp();
const FF = firebase.firestore.FieldValue.increment(+1);
const FB_ARRAY = firebase.firestore.FieldValue;
const db = Firebase.firestore();

export { Firebase, db, firebasetime };
