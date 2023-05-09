import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
   apiKey: "AIzaSyD-Lw52whp8Aai2FauG6GTKfFKEN8coQo4",
   authDomain: "dwf-m6-desafio-f0916.firebaseapp.com",
   databaseURL: "https://dwf-m6-desafio-f0916-default-rtdb.firebaseio.com",
   projectId: "dwf-m6-desafio-f0916",
   storageBucket: "dwf-m6-desafio-f0916.appspot.com",
   messagingSenderId: "489975553481",
   appId: "1:489975553481:web:67ce5f13e4f1d90a691c18",
};

const app = initializeApp(firebaseConfig);

const firebaseDatabase = getDatabase(app);

export { firebaseDatabase as firebaseDB };
