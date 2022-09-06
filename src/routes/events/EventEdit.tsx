import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { Fragment } from "preact";
import { route } from "preact-router";
import { useRef } from "preact/hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FadeInSlideRight } from "../../components/animations/FadeSlide";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
// Icons
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from "@mui/icons-material/Delete";
import PriBtn from "../../components/generic/PriBtn";
import SecBtn from "../../components/generic/SecBtn";

export default function EventEdit({ user, setHeaderTitle }) {
  setHeaderTitle("Event Edit");

  const [eventId] = useStorage("eventId");

  // Get the currentRace data
  const docRef = doc(db, "events", eventId);
  const [currentEvent, eventLoading] = useDocumentData(docRef);

  const formRef = useRef();

  const submittedToast = useToast();

  const submitHandler = async (values: any, { setSubmitting }) => {
    setSubmitting(true);
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

    setSubmitting(false);
    // route back to races
    history.back();
  };

  const deleteEvent = async () => {
    const eventToDelete = await deleteDoc(doc(db, "events", eventId));
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end" px={4}>
        <FadeInSlideRight>
          <Heading color="blue.400">Event Edit</Heading>
        </FadeInSlideRight>

        <Flex gap={2}>
          <ToolIconBtn
            label="Delete event"
            action={() => {
              deleteEvent();
              route("/events");
            }}
            icon={DeleteIcon}
          />
          <ToolIconBtn
            label="Clear form"
            action={() => {}}
            icon={ClearAllIcon}
          />
        </Flex>
      </Flex>

      <Divider my={4} border={4} shadow={"md"} />

      <Box mx={4} mb={8}>
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

              <Flex gap={2}>
                <PriBtn type="submit" width="100%">
                  Submit
                </PriBtn>
                <SecBtn type="reset">Reset</SecBtn>
              </Flex>
            </Form>
          </Formik>
        )}
      </Box>
    </Fragment>
  );
}
// export default EventEdit;
