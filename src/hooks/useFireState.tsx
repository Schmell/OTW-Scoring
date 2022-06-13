import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { StateUpdater, useEffect, useState } from "preact/hooks";
import { auth, db } from "../util/firebase-config";

/**
 * Similar to `useState` but with some lightweight behind-the-scenes
 * writing to firestore
 *
 * @param {string} key The string key name to be written to firebase
 * @param {string} fallback
 * @returns
 */

const useFireState = (key: string, fallback?: string): any[] => {
  // Thi shouldnt be this hard
  //
  const [user] = useAuthState(auth);
  const docRef = doc(db, "users", user!.uid);

  const [value, setValue] = useState(async () => {
    const currentDoc = await getDoc(docRef);
    const currentVal = currentDoc.data();
    if (currentVal![key]) return currentVal![key];
    return fallback;
  });

  useEffect(() => {
    const update = async () => {
      // get userData from firestore
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) {
        await setDoc(docRef, { [key]: fallback });
      } else {
        await updateDoc(docRef, { [key]: await value });
      }
    };

    update();
  }, [key, value]);

  return [value, setValue];
};

export default useFireState;
