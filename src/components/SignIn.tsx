import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../util/firebase-config";
import { Fragment, h } from "preact";

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
    <Fragment>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <button className="sign-in" onClick={signInWithGitHub}>
        Sign in with GitHub
      </button>
    </Fragment>
  );
}
