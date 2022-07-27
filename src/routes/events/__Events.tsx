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
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { AreYouSure } from "../../components/generic/AreYouSure";
// Icons
import ClearIcon from "@mui/icons-material/Clear";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";

export default function __Events({ user, setHeaderTitle }) {
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

      <Divider my={3} border={2} shadow={"md"} />

      <Box>
        <List px={4}>
          {eventsLoading ? (
            <Flex justifyContent=" center" alignItems="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          ) : (
            events?.docs.map((event) => (
              <FadeInSlideLeft>
                <ListItem key={event.id} py={4} borderRightRadius={8} shadow={"md"} my={6}>
                  <Flex justifyContent={"space-between"}>
                    <Box
                      w="80%"
                      mx={2}
                      cursor="pointer"
                      onClick={() => {
                        setEventId(event.id);
                        route("/events/event");
                      }}
                    >
                      <Text fontSize={"lg"} fontWeight={"semibold"}>
                        {event.data().name}
                      </Text>

                      <Text fontSize={"lg"} color={"gray.600"}>
                        {event.data().venue}
                      </Text>

                      <Text fontSize={"lg"} color={"gray.400"}>
                        {event.data().date}
                      </Text>
                    </Box>

                    <Flex>
                      <Tooltip label="Edit Event" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="Edit Event"
                          icon={(<Icon as={EditIcon} boxSize={7} />) as any}
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
                          icon={(<Icon as={ClearIcon} boxSize={7} />) as any}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={deleteEventDisclosure.onOpen}
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <AreYouSure disclosure={deleteEventDisclosure} colPath="events" itemId={event.id}>
                    <Box>This will delete the event and is not undo-able</Box>
                    <Box>You will loose any work you have done with this Event</Box>
                  </AreYouSure>
                </ListItem>
                {/* <Divider my={2} /> */}
              </FadeInSlideLeft>
            ))
          )}
        </List>
      </Box>
    </Fragment>
  );
}
