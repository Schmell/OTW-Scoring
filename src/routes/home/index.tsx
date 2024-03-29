import {
  Box,
  Button,
  Divider,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { h } from "preact";
import { Link } from "preact-router";
import { useEffect } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { useIndexedDBStore } from "use-indexeddb";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { SignIn } from "../../components/page/SignIn";
import { SignOut } from "../../components/page/SignOut";
import { auth } from "../../util/firebase-config";
import PublicSeriesList from "../series/PublicSeriesList";

export default function Home({ setHeaderTitle }) {
  const [user, userLoading, _userError] = useAuthState(auth);

  setHeaderTitle("Home");

  const { getAll, add } = useIndexedDBStore("user-params");

  const onClick = () => {
    add({ currentPage: "Competitors", headerTitle: "Home" }).then(console.log);
    getAll().then(console.log).catch(console.error);
  };

  const insertHome = () => {};

  // useEffect(() => {
  //   insertHome();
  // }, []);

  return (
    <Page>
      <PageHead title="On the Water Scoring" loading={userLoading}>
        {!user ? <SignIn /> : <SignOut />}
      </PageHead>
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

      {user && (
        <Box px={4} mb={16}>
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
      <PublicSeriesList />
    </Page>
  );
}
