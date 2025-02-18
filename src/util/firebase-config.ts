// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";


const firebaseConfig = {
  apiKey: "---",
  authDomain: "otw-scoring.firebaseapp.com",
  projectId: "otw-scoring",
  storageBucket: "otw-scoring.appspot.com",
  messagingSenderId: "96838791893",
  appId: "1:96838791893:web:65ca4be060160b8bf9285c",
  measurementId: "G-C492SFLJ7P"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage();

// Initialize Firebase emulators
if (location.hostname === "localhost"){
  connectFirestoreEmulator(db, "localhost", 9999);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "localhost", 9199);
}else{
  const app = initializeApp(firebaseConfig);
}


enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log("failed-precondition: (close other tabs first)", err.code);
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
  } else if (err.code == "unimplemented") {
    console.log("unimplemented: ", err.code);
    // The current browser does not support persistance
  }
});
