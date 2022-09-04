import { h } from "preact";
import { Avatar, Box, Flex } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import style from "./style.css";

const Footer = ({}) => {
  const [user] = useAuthState(auth);
  return (
    <Flex className={style.footer}>
      {/* <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" size="xs" /> */}
      <Box className={style.displayName} pl={2}>
        {user?.displayName}
      </Box>
    </Flex>
  );
};
export default Footer;
