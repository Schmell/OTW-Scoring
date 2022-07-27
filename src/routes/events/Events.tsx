import { Box, Divider, Flex, Heading, Icon, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { AreYouSure } from "../../components/generic/AreYouSure";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { SiteList } from "../../components/generic/SiteList";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import { SiteListItem } from "../../components/generic/SiteList/SiteListItem";
import { SiteListText } from "../../components/generic/SiteList/SiteListText";

export default function Events({ user, setHeaderTitle }) {
  setHeaderTitle("Events");

  const [_eventId, setEventId] = useStorage("eventId");

  const colRef = collection(db, "events");
  const ownerEvents = query(colRef, where("__owner", "==", user.uid));

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
      <Flex justifyContent="space-between" alignItems="end" px={4}>
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            All Events
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <Tooltip label="Import file" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="import"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              mr={2}
              onClick={() => route("/import")}
              icon={(<Icon as={FileUploadOutlinedIcon} />) as any}
            />
          </Tooltip>

          <Tooltip label="Add Event" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="add event"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
              onClick={addEventHandler}
            />
          </Tooltip>
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={4} border={4} />

      <SiteList loading={eventsLoading}>
        {events?.docs.map((item) => (
          <SiteListItem key={item.id} item={item} disclosure={deleteEventDisclosure} listType="series">
            <SiteListText
              item={item}
              setStorage={setEventId}
              forward="events/event"
              textItems={{ head: item.data().name, sub: item.data().venue, foot: item.data().date }}
            >
              <SiteListButtons
                setStorage={setEventId}
                item={item}
                listType="series"
                disclosure={deleteEventDisclosure}
              />
            </SiteListText>
            <AreYouSure disclosure={deleteEventDisclosure} colPath="series" itemId={item.id}>
              <Box>This will delete the event and is not undo-able</Box>
              <Box>You will loose any work you have done with this Event</Box>
            </AreYouSure>
          </SiteListItem>
        ))}
        {/* series?.docs.map */}
      </SiteList>
    </Fragment>
  );
}
