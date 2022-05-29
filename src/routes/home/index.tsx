import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import { SignIn } from "../../components/SignIn";
import { SignOut } from "../../components/SignOut";
import { auth } from "../../util/firebase-config";

const Home = ({ setHeaderTitle }) => {
  const [user] = useAuthState(auth);
  setHeaderTitle("Home");
  return (
    <Fragment>
      <Heading color="blue.400">
        <Flex justifyContent="space-between">
          <FadeInSlideRight>
            <Text>Home</Text>
          </FadeInSlideRight>
          <FadeInSlideLeft>{!user ? <SignIn /> : <SignOut />}</FadeInSlideLeft>
        </Flex>
      </Heading>
      <FadeInSlideRight>
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
      </FadeInSlideRight>
    </Fragment>
  );
};

export default Home;
