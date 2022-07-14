import { h } from "preact";
import { Box, Button } from "@chakra-ui/react";
// Firebase
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../util/firebase-config";

export function SignIn() {
  // const [user, userLoading] = useAuthState(auth);
  // console.log("user: ", user);
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
    <Box>
      <Button className="sign-in" variant="outline" colorScheme="blue" boxShadow="md" mr={3} onClick={signInWithGoogle}>
        Google Login
      </Button>

      <Button className="sign-in" variant="outline" colorScheme="blue" boxShadow="md" onClick={signInWithGitHub}>
        GitHub Login
      </Button>
    </Box>
  );
}
