import { Box, Divider, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";

export default function Events(props) {
  const { user, setHeaderTitle, ...rest } = props;
  setHeaderTitle("Events");
  const [eventId, setEventId] = useStorage("eventId");

  const colRef = collection(db, "events");
  const ownerEvents = query(colRef, where("__owner", "==", user && user.uid));

  const [events, eventsLoading] = useCollection(ownerEvents);
  const deleteEventDisclosure = useDisclosure();

  const addEventHandler = async () => {
    const docRef = await addDoc(colRef, {
      name: "New event",
      __owner: user.uid,
    });
    setEventId(docRef.id);
    route("/events/edit");
  };

  return (
    <Fragment>
      {/* <Flex justifyContent="space-between" alignItems="end" px={4}>
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            All Events
          </Heading>
        </FadeInSlideRight>

        <FadeInSlideLeft>
          <Flex gap={2}>
            <ToolIconBtn
              label="Import file"
              action={() => route("/import")}
              icon={FileUploadOutlinedIcon}
            />
            <ToolIconBtn
              label="Add Series"
              action={addEventHandler}
              icon={AddToPhotosOutlinedIcon}
            />
          </Flex>
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={4} border={4} /> */}

      <PageHead title="All Events">
        <ToolIconBtn
          label="Import file"
          action={() => route("/import")}
          icon={FileUploadOutlinedIcon}
        />
        <ToolIconBtn
          label="Add Series"
          action={addEventHandler}
          icon={AddToPhotosOutlinedIcon}
        />
      </PageHead>
      <Page>
        <SiteList loading={eventsLoading}>
          {events?.docs.map((item) => {
            const data = item.data();
            // setEventId(item.id);
            return (
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
            );
          })}
          {/* series?.docs.map */}
        </SiteList>
      </Page>
    </Fragment>
  );
}
