import style from "./style.css";

import { h } from "preact";
import { FC } from "preact/compat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";

interface footerProps {}

const Footer: FC<footerProps> = ({}) => {
  const [user] = useAuthState(auth);
  return (
    <div class={style.footer}>
      <span class={style.displayName}>{user?.displayName}</span>
    </div>
  );
};
export default Footer;
