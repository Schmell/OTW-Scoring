// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  doc,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// firebaseApps previously initialized using initializeApp()
// const db = getFirestore();
// connectFirestoreEmulator(db, 'localhost', 8080);
// const firebaseConfig = {
//   apiKey: "AIzaSyC7SFX9Qyr_b4AMGlM6bAUiG3BZBrh72B8",
//   authDomain: "schmell-first-try.firebaseapp.com",
//   databaseURL: "https://schmell-first-try-default-rtdb.firebaseio.com",
//   projectId: "schmell-first-try",
//   storageBucket: "schmell-first-try.appspot.com",
//   messagingSenderId: "464776014382",
//   appId: "1:464776014382:web:8667afbe5dec4c4408cdbf",
//   measurementId: "G-Q077CT5BYW",
// };

const firebaseConfig = {
  apiKey: "AIzaSyC7SFX9Qyr_b4AMGlM6bAUiG3BZBrh72B8",
  authDomain: "schmell-first-try.firebaseapp.com",
  databaseURL: "https://schmell-first-try-default-rtdb.firebaseio.com",
  projectId: "schmell-first-try",
  storageBucket: "schmell-first-try.appspot.com",
  messagingSenderId: "464776014382",
  appId: "1:464776014382:web:8667afbe5dec4c4408cdbf",
  measurementId: "G-Q077CT5BYW",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Get rid of this
// export const eRef = doc(db, "events/XSKmjOrjRRa3BsehsHH1");
// export const [user] = useAuthState(auth);
// Initialize Firebase
connectFirestoreEmulator(db, "localhost", 9999);
connectAuthEmulator(auth, "http://localhost:9099");

// 5;

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log("failed-precondition: (close other tabs first)", err.code);
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
  } else if (err.code == "unimplemented") {
    console.log("unimplemented: ", err.code);
    // The current browser does not support persistance
  }
});
