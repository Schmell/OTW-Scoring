import {
  Box,
  Flex,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection } from "react-firebase-hooks/firestore";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { auth, db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import ToolIconButton from "../../components/generic/ToolIconButton";
import { addOrganization } from "../organizations/addOrganization";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthState } from "react-firebase-hooks/auth";
import SearchOptions from "./SearchOptions";

interface SearchEventsProps {}

export default function SearchEvents(props) {
  const { user, setHeaderTitle } = props;
  //   const [user] = useAuthState(auth);
  setHeaderTitle("Search Events");
  //   console.log("user ", user);
  const [eventId, setEventId] = useStorage("eventId");

  const eventsRef = collection(db, "events");
  const publicEventsQuery = query(
    eventsRef,
    where("__owner", "!=", user && user?.uid),
    where("__public", "==", true)
  );
  const [events, eventsLoading] = useCollection(publicEventsQuery);

  const deleteEventDisclosure = useDisclosure();

  return (
    <Fragment>
      <PageHead title="Search Events" loading={eventsLoading}></PageHead>

      <Page>
        <Flex gap={2} mx={4} my={4}>
          {/* <Input name="search" /> */}
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={SearchIcon} />}
            />
            <Input placeholder="Find Organization" onChange={() => {}} />
          </InputGroup>
          <ToolIconButton
            aria-label="add Organization"
            icon={AddToPhotosOutlinedIcon}
            onClick={() => {
              // addOrganization(user?.uid);
            }}
          />
          <SearchOptions />
        </Flex>

        <SiteList loading={eventsLoading}>
          {events?.docs.map((item) => {
            const data = item.data();
            return (
              <Fragment>
                {!data.__owner ?? <Text>You have no Items</Text>}
                <SiteListItem
                  key={item.id}
                  item={item}
                  disclosure={deleteEventDisclosure}
                  listType="series"
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
                    <SiteListButtons
                      setStorage={setEventId}
                      item={item}
                      listType="events"
                      disclosure={deleteEventDisclosure}
                    >
                      <Box>This will delete the event and is not undo-able</Box>
                      <Box>
                        You will loose any work you have done with this Event
                      </Box>
                    </SiteListButtons>
                  </SiteListText>
                </SiteListItem>
              </Fragment>
            );
          })}
        </SiteList>
      </Page>
    </Fragment>
  );
}
