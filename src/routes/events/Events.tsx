import { Box, Divider, Flex, Heading, IconButton, List, ListItem, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { MdClear, MdLibraryAdd, MdModeEdit } from "react-icons/md";
import { route } from "preact-router";
import useStorage from "../../hooks/useStorage";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useCollectionData } from "react-firebase-hooks/firestore";
import style from "./style.css";
import { BsXLg } from "react-icons/bs";

const Events = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Events");
  console.log("events - user: ", user);
  const [eventId, setEventId] = useStorage("eventId");

  const colRef = collection(db, "events");
  const [events, eventsLoading] = useCollectionData(colRef);

  const addEventHandler = async () => {
    const docRef = await addDoc(colRef, { name: "New event" });
    setEventId(docRef.id);
    route("/events/edit");
  };

  const removeEvent = async (id: any) => {
    // Uses cloud function to remove any sub-collections
    await deleteDoc(doc(db, "event", id));
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
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          ) : (
            events?.map((event) => (
              <FadeInSlideLeft>
                <ListItem key={event.id} className={style.selectList}>
                  <Flex justifyContent={"space-between"}>
                    <Box>
                      <Text as="h2">{event.name}</Text>
                      <Text fontSize={"sm"} color={"gray.400"}>
                        {event.venue}
                      </Text>
                      <Text fontSize={"xs"} color={"gray.400"}>
                        {event.date}
                      </Text>
                    </Box>
                    <Box>
                      <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="edit series"
                          icon={<MdModeEdit />}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setEventId(event.id);
                            route("/events/edit");
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="Delete series"
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
