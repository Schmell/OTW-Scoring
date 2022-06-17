import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
import { MdClearAll, MdDelete, MdLibraryAdd } from "react-icons/md";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Formik, Form, Field } from "formik";
import { route } from "preact-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

const EventEdit = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Event Edit");
  //   console.log("EventForm - user: ", user);
  const [eventId] = useStorage("eventId");

  // Get the currentRace data
  const docRef = doc(db, "events", eventId);
  const [currentEvent, eventLoading] = useDocumentData(docRef);

  const submittedToast = useToast();

  const submitHandler = async (values: any) => {
    console.log("values: ", values);

    // update the firestore doc
    // here we may need to add modified flag or something
    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Event Updated",
      description: "Your series properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // route back to races
    route("/events");
  };

  const deleteEvent = async () => {
    const eventToDelete = await deleteDoc(doc(db, "events", eventId));
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Event Edit
          </Heading>
        </FadeInSlideRight>
        <Box>
          <Tooltip
            label="Delete event"
            hasArrow
            bg="blue.300"
            placement="bottom-start"
          >
            <IconButton
              aria-label="Delete Event"
              icon={<MdDelete />}
              colorScheme={"blue"}
              mr={2}
              variant={"outline"}
              boxShadow={"md"}
              onClick={() => {
                deleteEvent();
                route("/events");
              }}
            />
          </Tooltip>

          <Tooltip
            label="Clear form"
            hasArrow
            bg="blue.300"
            placement="bottom-start"
          >
            <IconButton
              aria-label="Add Event"
              icon={<MdClearAll />}
              colorScheme={"blue"}
              variant={"outline"}
              boxShadow={"md"}
            />
          </Tooltip>
        </Box>
      </Flex>

      <Divider mt={3} />

      <Box>
        {currentEvent && (
          <Formik
            initialValues={{
              name: currentEvent.name,
              venue: currentEvent.venue,
              date: currentEvent.date,
            }}
            onSubmit={submitHandler}
          >
            <Form>
              <FormLabel htmlFor="name">Event Name</FormLabel>
              <Field name="name" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="venue">Venue</FormLabel>
              <Field name="venue" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="date">Date</FormLabel>
              <Field name="date" type="date" as={Input} />

              <Divider my={3} />

              <Button type="submit" colorScheme="blue" w="100%" my={4}>
                Submit
              </Button>
            </Form>
          </Formik>
        )}
      </Box>
    </Fragment>
  );
};
export default EventEdit;