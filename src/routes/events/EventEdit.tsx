import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Input,
  Select,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import { addOrganization } from "../organizations/addOrganization";
// Icons
import AddToPhotosOutlined from "@mui/icons-material/AddToPhotosOutlined";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from "@mui/icons-material/Delete";
import PriBtn from "../../components/generic/PriBtn";
import SecBtn from "../../components/generic/SecBtn";
import ToolIconButton from "../../components/generic/ToolIconButton";

export default function EventEdit({ user, setHeaderTitle }) {
  setHeaderTitle("Event Edit");

  const [eventId] = useStorage("eventId");

  // Get the currentRace data
  const docRef = doc(db, "events", eventId);
  const [currentEvent, eventLoading] = useDocumentData(docRef);

  // const eventsRef = collection(db, "events");
  // const userEvents = query(eventsRef, where("__owner", "==", user?.uid));
  // const [events, eventsLoading] = useCollection(userEvents);

  const [orgName, setOrgName] = useState(currentEvent?.organization);

  const orgsRef = collection(db, "organizations");
  const userOrgsQuery = query(orgsRef, where("__owner", "==", user.uid));
  const [userOrgs, userOrgsLoading] = useCollection(userOrgsQuery);

  const submittedToast = useToast();

  const submitHandler = async (values: any, { setSubmitting }) => {
    setSubmitting(true);
    console.log("values ", values);
    // Remove undefined's
    Object.keys(values).forEach((key) =>
      values[key] === undefined ? delete values[key] : {}
    );
    values.lastModified = serverTimestamp();
    // /////////////////////////////////////////////////////////////////
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
    history.back();
  };

  const deleteEvent = async () => {
    const eventToDelete = await deleteDoc(doc(db, "events", eventId));
  };

  return (
    <Fragment>
      <PageHead title="Event Edit">
        <ToolIconBtn
          label="Delete event"
          action={() => {
            deleteEvent();
            route("/events");
          }}
          icon={DeleteIcon}
        />
        <ToolIconBtn label="Clear form" action={() => {}} icon={ClearAllIcon} />
      </PageHead>

      <Page>
        <Box p={4}>
          {currentEvent && (
            <Formik
              initialValues={{
                name: currentEvent.name,
                organization: currentEvent.organization,
                venue: currentEvent.venue,
                date: currentEvent.date,
              }}
              onSubmit={submitHandler}
            >
              {({
                isSubmitting,
                getFieldProps,
                handleChange,
                handleBlur,
                values,
              }) => (
                <Form>
                  <Flex justifyContent={"end"}>
                    <FormLabel htmlFor="__public">Public: </FormLabel>
                    <Field
                      name="__public"
                      as={Switch}
                      defaultChecked={currentEvent.__public}
                      value="true"
                    />
                  </Flex>

                  <FormLabel htmlFor="name">Event Name</FormLabel>
                  <Field name="name" as={Input} />

                  <Divider my={3} />

                  <FormLabel htmlFor="organization">Organization</FormLabel>
                  {/* <Field name="organization" as={Input} /> */}
                  {/* <Field as={() => <Select value={"hey"} />}></Field> */}
                  <Flex gap={2}>
                    <Field name="organization" as={Select}>
                      {userOrgs?.docs.map((org) => {
                        // console.log("userOrgs?.docs ", );
                        return (
                          <option value={org.id}>{org.data().orgName}</option>
                        );
                      })}
                      {/* <option value="add">Add Organization</option> */}
                    </Field>
                    <ToolIconButton
                      aria-label="add Organization"
                      icon={AddToPhotosOutlined}
                      onClick={() => {
                        addOrganization(user.uid);
                      }}
                    />
                  </Flex>

                  <Divider my={3} />

                  <FormLabel htmlFor="venue">Venue</FormLabel>
                  <Field name="venue" as={Input} />
                  <Text>{orgName}</Text>

                  <Divider my={3} />

                  <FormLabel htmlFor="date">Date</FormLabel>
                  <Field name="date" type="date" as={Input} />

                  <Divider my={3} />

                  <Flex gap={2}>
                    <PriBtn
                      type="submit"
                      width="full"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                    >
                      Submit
                    </PriBtn>
                    <SecBtn type="reset">Reset</SecBtn>
                  </Flex>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Page>
    </Fragment>
  );
}
// export default EventEdit;
