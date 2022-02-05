import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

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
// export const analytics = getAnalytics(app);
