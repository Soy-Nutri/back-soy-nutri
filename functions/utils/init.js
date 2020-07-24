const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyALmRLz5OdSc1TTkdy9I82GsdnPWwkmeOM",
  authDomain: "back-f0378.firebaseapp.com",
  databaseURL: "https://back-f0378.firebaseio.com",
  projectId: "back-f0378",
  storageBucket: "back-f0378.appspot.com",
  messagingSenderId: "307536676623",
  appId: "1:307536676623:web:eb7f8c3e1f37ec3c78a07a",
  measurementId: "G-HK08MQNVM5",
};
firebase.initializeApp(firebaseConfig);

module.exports = { admin, db, functions, firebase, firebaseConfig };
