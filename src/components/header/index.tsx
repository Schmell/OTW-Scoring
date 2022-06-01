import { h } from "preact";
import { Link } from "preact-router/match";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { FadeIn } from "../animations/FadeSlide";
import ColorModeToggle from "../ColorToggleMode";
import style from "./style.css";

const Header = ({ headerTitle, setHeaderTitle }) => {
  const [user] = useAuthState(auth);
  return (
    <header class={style.header}>
      <FadeIn>
        <div>
          <h1>{headerTitle}</h1>
        </div>
      </FadeIn>

      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>

        {/* <ColorModeToggle /> */}

        <Link activeClassName={style.active} href="/series">
          Series
        </Link>
      </nav>
    </header>
  );
};

export default Header;
