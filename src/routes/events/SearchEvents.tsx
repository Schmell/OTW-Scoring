import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection,
  getDocs,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { useEffect } from "preact/hooks";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Options } from "react-firebase-hooks/firestore/dist/firestore/types";
import FollowButtons from "../../components/generic/FollowButtons";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { useAsync } from "../../hooks/useAsync";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import SearchOptions from "./SearchOptions";
import LibraryAddTwoToneIcon from "@mui/icons-material/LibraryAddTwoTone";

interface SearchEventsProps {}

export default function SearchEvents(props) {
  const { user, setHeaderTitle } = props;
  //   const [user] = useAuthState(auth);
  setHeaderTitle("Search Events");
  const [country, setCountry] = useState("*");
  const [org, setOrg] = useState(null);
  //   console.log("user ", user);
  const [eventId, setEventId] = useStorage("eventId");

  const followEventsRef = collection(db, "followEvents");
  const [following, followingLoading] = useCollection(
    query(followEventsRef, where("userId", "==", user.uid))
  );

  const eventsRef = collection(db, "events");

  let constraints: QueryConstraint[] = [];

  // constraints.push(where("__owner", "!=", user?.uid));

  constraints.push(where("__public", "==", true));
  if (!followingLoading) {
    following?.docs.map((doc) => {
      // constraints.push(where("id", "==", doc.data().followId));
    });
  }
  // useEffect(() => {
  //   constraints.push(where("organization", "==", org));
  //   console.log("org ", org);
  // }, [org, country]);

  // console.log("constraints ", ...constraints);
  const q = query(eventsRef, ...constraints);

  const [events, eventsLoading] = useCollection(q);

  const { execute, status, value, error } = useAsync(myFunction, false);
  // execute();
  async function myFunction() {
    console.log("org ", org);
    const orgQuery = query(q, where("organization", "==", org));
    return await getDocs(orgQuery);
  }

  useEffect(() => {
    following?.docs.map((doc) => {
      // console.log("follow ", doc.data());
    });
    //
    // console.log("error ",  error);
    value?.docs.map((doc) => {
      console.log("doc ", doc.data().name, doc.data().__public);
    });
  }, [status, error]);

  const deleteEventDisclosure = useDisclosure();

  return (
    <Fragment>
      <Page>
        <PageHead title="Search Events" loading={eventsLoading}>
          <ToolIconButton
            aria-label="Add Organization"
            icon={AddToPhotosOutlinedIcon}
            onClick={() => {}}
          />
        </PageHead>

        {!eventsLoading && events && (
          <Fragment>
            <Flex gap={2} mx={4} mt={4} mb={1}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="blue.500"
                  children={<Icon as={SearchIcon} />}
                />
                <Input
                  placeholder="Find Event"
                  bg={useColorModeValue("white", "blackAlpha.400")}
                  onChange={() => {}}
                />
              </InputGroup>
              <ToolIconButton
                aria-label="Add Event"
                bg={useColorModeValue("white", "blackAlpha.400")}
                icon={AddToPhotosOutlinedIcon}
                onClick={() => {
                  // addOrganization(user?.uid);
                }}
              />
            </Flex>
            <SearchOptions setCountry={setCountry} setOrg={setOrg} />
            {/* <Button onClick={execute} m={4}>
              click me
            </Button> */}
            {events.docs
              .filter((item) => {
                let test;
                following?.docs.forEach((doc) => {
                  if (doc.data().followId !== item.id) test = false;
                });
                console.log("test ", test);
                if (test) return test;
                return true;

                // return item;
              })
              .map((mapped) => {
                console.log("mapped ", mapped.data().name);
              })}

            <SiteList>
              {events?.docs.map((item) => {
                const data = item.data();

                return (
                  <Fragment>
                    <SiteListItem
                      key={item.id}
                      item={item}
                      disclosure={deleteEventDisclosure}
                      listType="events"
                    >
                      <SiteListText
                        item={item}
                        setStorage={setEventId}
                        forward="events/event"
                        textItems={{
                          head: data.name,
                          sub: data.venue,
                          foot: data.date,
                        }}
                      >
                        <FollowButtons
                          user={user}
                          data={item!}
                          variant="ghost"
                          colName="followEvents"
                        />
                      </SiteListText>
                    </SiteListItem>
                  </Fragment>
                );
              })}
            </SiteList>
          </Fragment>
        )}
      </Page>
    </Fragment>
  );
}
