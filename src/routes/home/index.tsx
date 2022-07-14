import { Fragment, h } from "preact";
import { Link } from "preact-router";
import { Box, Divider, Flex, Heading, ListItem, Spinner, Text, UnorderedList } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import { SignIn } from "../../components/SignIn";
import { SignOut } from "../../components/SignOut";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";

const Home = ({ setHeaderTitle }) => {
  const [user, userLoading, userError] = useAuthState(auth);

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
            On The Water RC is sailboat racing scoring companion for the popular Sailwave desktop application
          </Text>
        </Box>
      </FadeInSlideRight>

      {userLoading ? (
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      ) : (
        <Fragment>
          <Divider my={5} />
          <Heading as="h4" fontSize={"lg"}>
            Where too from here
          </Heading>
          <UnorderedList spacing={1} mt={2}>
            <ListItem>
              <Link href="/import">
                <Text color={"blue.600"}>Upload a sailwave file</Text>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/series">
                <Text color={"blue.600"}>Select a Series</Text>
              </Link>
            </ListItem>
          </UnorderedList>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
