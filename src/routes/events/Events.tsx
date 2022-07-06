import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { MdClear, MdLibraryAdd, MdModeEdit } from "react-icons/md";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import style from "./style.css";

const Events = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Events");

  const [eventId, setEventId] = useStorage("eventId");

  const colRef = collection(db, "events");
  const ownerEvents = query(colRef, where("__owner", "==", user.uid));

  const [events, eventsLoading] = useCollection(ownerEvents);

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

        <Tooltip
          label="Add Event"
          hasArrow
          bgColor={"blue.300"}
          placement="bottom-start"
        >
          <IconButton
            aria-label="Add Event"
            icon={<MdLibraryAdd />}
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
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            events?.docs.map((event) => (
              <FadeInSlideLeft>
                <ListItem key={event.id} className={style.selectList}>
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

                      <Text fontSize={"sm"} color={"gray.400"}>
                        {event.data().venue}
                      </Text>

                      <Text fontSize={"xs"} color={"gray.400"}>
                        {event.data().date}
                      </Text>
                    </Box>

                    <Box>
                      <Tooltip
                        label="Edit Series"
                        hasArrow
                        bg="blue.300"
                        placement="bottom-start"
                      >
                        <IconButton
                          aria-label="edit series"
                          icon={<MdModeEdit />}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setEventId(event.data().id);
                            route("/events/edit");
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Remove Series"
                        hasArrow
                        bg="blue.300"
                        placement="bottom-start"
                      >
                        <IconButton
                          aria-label="Remove series"
                          icon={<MdClear />}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={(e) => {
                            e.preventDefault();
                            removeEvent(event.id);
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Flex>
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
