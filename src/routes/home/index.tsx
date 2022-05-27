import style from "./style.css";
import { Fragment, h } from "preact";
import { FC } from "preact/compat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { SignIn } from "../../components/SignIn";
import { SignOut } from "../../components/SignOut";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";

const Home = ({ headerTitle, setHeaderTitle }) => {
  const [user] = useAuthState(auth);
  setHeaderTitle("Home");
  return (
    <Fragment>
      <Heading color="blue.400">
        <Flex justifyContent="space-between">
          <Text>Home</Text>
          {!user ? <SignIn /> : <SignOut />}
        </Flex>
      </Heading>
      <Box m={3}>
        <Text fontSize="lg" fontWeight="bold">
          Welcome to On the Water RC
        </Text>
        <Divider my={3} />
        <Text fontSize="md">
          On The Water RC is sailboat racing scoring companion for the popular
          Sailwave desktop application
        </Text>
      </Box>
    </Fragment>
  );
};

export default Home;
