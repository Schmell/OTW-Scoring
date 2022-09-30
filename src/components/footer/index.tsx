import { h } from "preact";
import { Avatar, Box, Flex } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";

export default function Footer({}) {
  return (
    <Flex
      position="fixed"
      bottom={0}
      height="34px"
      bg="blue.500"
      w="100%"
      borderTopLeftRadius={18}
    ></Flex>
  );
}
