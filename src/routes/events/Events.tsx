import { Fragment, h } from "preact";
import { route } from "preact-router";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { addDoc, collection, deleteDoc, doc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import style from "./style.css";
// import { MdClear, MdLibraryAdd, MdModeEdit } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { AreYouSure } from "../../components/generic/AreYouSure";

const Events = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Events");

  const [eventId, setEventId] = useStorage("eventId");

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

  const removeEvent = async (id: any) => {
    await deleteDoc(doc(db, "events", id));
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Select event
          </Heading>
        </FadeInSlideRight>

        <Tooltip label="Add Event" hasArrow bgColor={"blue.300"} placement="bottom-start">
          <IconButton
            aria-label="Add Event"
            icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
            colorScheme={"blue"}
            variant={"outline"}
            boxShadow={"md"}
            onClick={addEventHandler}
          />
        </Tooltip>
      </Flex>

      <Divider mt={3} />

      <Box>
        <List>
          {eventsLoading ? (
            <Flex justifyContent=" center" alignItems="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          ) : (
            events?.docs.map((event) => (
              <FadeInSlideLeft>
                <ListItem key={event.id} pb={4}>
                  <Flex justifyContent={"space-between"}>
                    <Box
                      w="80%"
                      cursor="pointer"
                      onClick={() => {
                        setEventId(event.id);
                        route("/events/event");
                      }}
                    >
                      <Text as="h2">{event.data().name}</Text>

                      <Text fontSize={"sm"} color={"gray.600"}>
                        {event.data().venue}
                      </Text>

                      <Text fontSize={"xs"} color={"gray.400"}>
                        {event.data().date}
                      </Text>
                    </Box>

                    <Box>
                      <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="edit series"
                          icon={(<Icon as={EditIcon} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setEventId(event.data().id);
                            route("/events/edit");
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Event" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="Delete Event"
                          icon={(<Icon as={ClearIcon} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={deleteEventDisclosure.onOpen}
                        />
                      </Tooltip>
                    </Box>
                  </Flex>
                  <AreYouSure disclosure={deleteEventDisclosure} colPath="events" itemId={event.id}>
                    <Box>This will delete the event and is not undo-able</Box>
                    <Box>You will loose any work you have done with this Event</Box>
                  </AreYouSure>
                </ListItem>
              </FadeInSlideLeft>
            ))
          )}
        </List>
      </Box>
    </Fragment>
  );
};
export default Events;
