import { h } from "preact";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { SignIn } from "../../components/page/SignIn";
import { SignOut } from "../../components/page/SignOut";

export default function Unauthed() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h1>Sign in to use this feature</h1>
      {!user ? <SignIn /> : <SignOut />}
    </div>
  );
}

// export default Unauthed;
