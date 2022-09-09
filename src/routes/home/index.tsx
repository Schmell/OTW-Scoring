import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  ListItem,
  Progress,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { Link } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import { SignIn } from "../../components/page/SignIn";
import { SignOut } from "../../components/page/SignOut";
import { auth } from "../../util/firebase-config";

const Home = ({ setHeaderTitle }) => {
  const [user, userLoading, _userError] = useAuthState(auth);

  setHeaderTitle("Home");

  return (
    <Fragment>
      <Heading color="blue.400">
        <Flex justifyContent="space-between" px={4}>
          <FadeInSlideRight>
            <Text>On the Water Scoring</Text>
          </FadeInSlideRight>
          <FadeInSlideLeft>{!user ? <SignIn /> : <SignOut />}</FadeInSlideLeft>
        </Flex>
      </Heading>

      <Divider my={4} border={4} shadow={"md"} />

      <FadeInSlideRight>
        <Box m={7}>
          <Text fontSize="lg" fontWeight="bold">
            Welcome to On the Water Scoring
          </Text>

          <Divider my={3} />

          <Text fontSize="md">
            <Image
              src="../assets/img/homePage.jpeg"
              boxSize="180px"
              float={"right"}
            />
            On The Water Scoring (OTW) is sailboat racing scoring application
            and companion for the popular Sailwave desktop application. You can
            Import sailwave .blw files and use them directly in the app. I have
            added the event collection to help organize your series'. We
            recommend to start with this.
          </Text>
        </Box>
      </FadeInSlideRight>

      {userLoading ? (
        <Progress size="xs" isIndeterminate />
      ) : (
        <Box px={4} mb={10}>
          <Divider my={5} />
          <Heading as="h4" fontSize={"lg"}>
            Where too from here
          </Heading>
          <UnorderedList spacing={1} mt={2}>
            <ListItem>
              <Link href="/import">
                <Text color={"blue.600"}>Import a sailwave file</Text>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/events">
                <Text color={"blue.600"}>Create an event</Text>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/series">
                <Text color={"blue.600"}>Select a Series</Text>
              </Link>
            </ListItem>
          </UnorderedList>
        </Box>
      )}
    </Fragment>
  );
};

export default Home;
