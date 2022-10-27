import { h, Fragment } from "preact";
// Firebase
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../util/firebase-config";
import SecBtn from "../generic/SecBtn";
import { Box, Button, Flex } from "@chakra-ui/react";

export function SignIn() {
  const setUserData = async ({ user }) => {
    if (user) {
      const userDoc = doc(db, "user", user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) return;

      await setDoc(userDoc, {
        uid: user.uid,
        displayName: user.displayName,
        nickname: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
      });
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const sign = await signInWithPopup(auth, provider);
    setUserData(sign);
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    const sign = await signInWithPopup(auth, provider);
    setUserData(sign);
  };

  return (
    <Box textAlign={"right"}>
      <Button mb={2} onClick={signInWithGoogle}>
        Google Login
      </Button>
      <Button onClick={signInWithGitHub}>GitHub Login</Button>
    </Box>
  );
}
