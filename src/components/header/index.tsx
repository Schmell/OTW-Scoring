import { h } from "preact";
import { Link } from "preact-router/match";
import { FC } from "preact/compat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import style from "./style.css";

const Header: FC = () => {
  const [user] = useAuthState(auth);
  return (
    <header class={style.header}>
      <div>
        <h1>Blw Me</h1>
      </div>

      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>

        <Link activeClassName={style.active} href="/series">
          Series
        </Link>

        <Link activeClassName={style.active} href="/races">
          Races
        </Link>
      </nav>
    </header>
  );
};

export default Header;
