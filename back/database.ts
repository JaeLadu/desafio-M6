import { database, firestore } from "firebase-admin";
import { applicationDefault, initializeApp } from "firebase-admin/app";
// const key = require("./firebaseKey.json"); line needed if importing from json file key

//environment saved key
const app = initializeApp({
   credential: applicationDefault(),
   databaseURL: "https://dwf-m6-desafio-f0916-default-rtdb.firebaseio.com/",
});

//imported from json file key
// const app = initializeApp({
//    credential: credential.cert(key),
//    databaseURL: "https://dwf-m6-desafio-f0916-default-rtdb.firebaseio.com/",
// });

const firebaseDatabase = database();
const firestoreDatabase = firestore();

export { firebaseDatabase, firestoreDatabase };
