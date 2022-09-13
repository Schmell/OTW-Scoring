// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyC7SFX9Qyr_b4AMGlM6bAUiG3BZBrh72B8",
//   authDomain: "schmell-first-try.firebaseapp.com",
//   databaseURL: "https://schmell-first-try-default-rtdb.firebaseio.com",
//   projectId: "schmell-first-try",
//   storageBucket: "schmell-first-try.appspot.com",
//   messagingSenderId: "464776014382",
//   appId: "1:464776014382:web:8667afbe5dec4c4408cdbf",
//   measurementId: "G-Q077CT5BYW"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCbGouPxwVKd5GkLJAoNGMhIIlDz2CViw4",
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


enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log("failed-precondition: (close other tabs first)", err.code);
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
  } else if (err.code == "unimplemented") {
    console.log("unimplemented: ", err.code);
    // The current browser does not support persistance
  }
});
