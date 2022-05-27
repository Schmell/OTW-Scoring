import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../util/firebase-config";
import { Fragment, h } from "preact";
import { Box, Button, Divider } from "@chakra-ui/react";

export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <Box>
      <Button
        className="sign-in"
        variant="outline"
        colorScheme="blue"
        boxShadow="md"
        mr={3}
        onClick={signInWithGoogle}
      >
        Google Login
      </Button>

      <Button
        className="sign-in"
        variant="outline"
        colorScheme="blue"
        boxShadow="md"
        onClick={signInWithGitHub}
      >
        GitHub Login
      </Button>
    </Box>
  );
}
