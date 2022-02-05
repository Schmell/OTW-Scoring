import style from "./style.css";
import { h } from "preact";
import { FC } from "preact/compat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { SignIn } from "../../components/SignIn";
import { SignOut } from "../../components/SignOut";

const Home: FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div class={style.home}>
      <h1>Home</h1>
      <p> Welcome to On the Water RC</p>
      {!user ? <SignIn /> : <SignOut />}
    </div>
  );
};

export default Home;
