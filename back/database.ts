import { credential, database, firestore } from "firebase-admin";
import { applicationDefault, initializeApp } from "firebase-admin/app";

const environment = process.env.ENVIRONMENT;
if (environment == "development") {
   //environment saved key
   const app = initializeApp({
      credential: applicationDefault(),
      databaseURL: "https://dwf-m6-desafio-f0916-default-rtdb.firebaseio.com/",
   });
}
if (environment == "Production") {
   const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
   //imported from json file key
   const app = initializeApp({
      credential: credential.cert(key),
      databaseURL: "https://dwf-m6-desafio-f0916-default-rtdb.firebaseio.com/",
   });
}

const firebaseDatabase = database();
const firestoreDatabase = firestore();

export { firebaseDatabase, firestoreDatabase };
