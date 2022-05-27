import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import { doc, updateDoc } from "firebase/firestore";
import { Field, FieldArray, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { formatDate, formatTime } from "../../util/formatters";
import { AddStartModal } from "./RaceProperties/AddStartModal";
import style from "./scoring.css";

export const RaceProperties = ({ setHeaderTitle }) => {
  setHeaderTitle("Race form");
  interface IraceStarts {
    fleet: string;
    start: string;
  }

  // Get the current navigation id's
  // only need the getters here
  const [raceId] = useStorage("raceId");
  const [seriesId] = useStorage("seriesId");

  // Set state for form values
  // Not sure why these are the only ones i need to set state for
  const [raceTime, setRaceTime] = useState<string>();
  const [raceStarts, setRaceStarts] = useState<IraceStarts[]>();

  const submittedToast = useToast();

  // Need this for the AddStartModal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get the currentRace data
  const docRef = doc(db, "events", seriesId, "races", raceId);
  const [currentRace, loading, error] = useDocumentData(docRef);

  if (!loading) {
    setRaceTime(formatTime(currentRace?.time));
    setRaceStarts(currentRace?.starts);
  }

  const submitHandler = async (values: any) => {
    await updateDoc(docRef, values);
    submittedToast({
      title: "Race Updated",
      description: "Your race properties have changed",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };

  const handleSetTime = async () => {
    const theDate = Temporal.Now.plainTimeISO();
    await updateDoc(docRef, { time: `${theDate.round("minutes")}` });
    setRaceTime(`${theDate.round("minutes")}`);
  };

  return (
    <Fragment>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          {/* This is the header with race name or number */}
          <FadeInSlideRight>
            <Heading as="h5" color="blue.400">
              {currentRace?.name
                ? currentRace.name
                : `Race ${currentRace?.rank}`}
            </Heading>
          </FadeInSlideRight>
          <FadeInSlideLeft>
            <Text fontSize="sm" color="lightgray">
              id: {currentRace?.raceid} - {currentRace?._seriesid}
            </Text>
          </FadeInSlideLeft>
        </Flex>

        <Divider my={3} />
        <FadeInSlideLeft>
          <Box mx={4}>
            <Formik
              enableReinitialize
              initialValues={{
                resultType: "finish",
                date: formatDate(currentRace?.date),
                sailed: currentRace?.sailed,
                time: raceTime,
                starts: raceStarts,
                notes: currentRace?.notes,
              }}
              onSubmit={submitHandler}
            >
              {({ values }) => (
                <Form className={style.raceform}>
                  <Field name="resultType">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel htmlFor="resultType">Scoring type</FormLabel>
                        <RadioGroup
                          {...field}
                          id="resultType"
                          colorScheme="blue"
                        >
                          <HStack className={style.radiolabel}>
                            <Field
                              type="radio"
                              name="resultType"
                              value="position"
                              as={Radio}
                            >
                              Position
                            </Field>
                            <Field
                              type="radio"
                              name="resultType"
                              value="elapsed"
                              as={Radio}
                            >
                              Elapsed
                            </Field>
                            <Field
                              type="radio"
                              name="resultType"
                              value="finish"
                              as={Radio}
                            >
                              Finishes
                            </Field>
                          </HStack>
                        </RadioGroup>
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Divider my={3} />

                  {/* Date */}
                  <Box>
                    <FormControl>
                      <FormLabel htmlFor="date">Date: </FormLabel>
                      <Field type="date" name="date" />
                    </FormControl>
                  </Box>
                  <Divider my={3} />
                  <Box>
                    <Field name="sailed">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel htmlFor="sailed">Sailed</FormLabel>
                          <RadioGroup {...field} id="sailed" colorScheme="blue">
                            <HStack className={style.radiolabel}>
                              <Field
                                type="radio"
                                name="sailed"
                                value="1"
                                as={Radio}
                              >
                                Sailed
                              </Field>
                              <Field
                                type="radio"
                                name="sailed"
                                value="cancelled"
                                as={Radio}
                              >
                                Cancelled
                              </Field>
                              <Field
                                type="radio"
                                name="sailed"
                                value="postponed"
                                as={Radio}
                              >
                                Postponed
                              </Field>
                            </HStack>
                          </RadioGroup>
                          {field.value === "postponed" && (
                            <Fragment>
                              <FormLabel htmlFor="postponedDate" mt={3}>
                                Postponed Date
                              </FormLabel>
                              <Field
                                name="postponedDate"
                                type="datetime-local"
                                as={Input}
                              ></Field>
                            </Fragment>
                          )}
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Divider my={3} />

                  {/* First gun  */}
                  <FormLabel htmlFor="time">First gun</FormLabel>
                  <Box d="flex" justifyContent="space-between">
                    {/* Need to get seconds here */}
                    <Field
                      name="time"
                      type="time"
                      step="2"
                      as={Input}
                      border="none"
                    />
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      boxShadow="md"
                      px={8}
                      ml={4}
                      onClick={handleSetTime}
                    >
                      Set Time
                    </Button>
                  </Box>

                  <Divider my={3} />

                  {/* Starts */}
                  <Box display="flex" justifyContent="space-between">
                    <FormLabel htmlFor="starts">Starts</FormLabel>
                    <IconButton
                      aria-label="Add start"
                      colorScheme="blue"
                      variant="outline"
                      boxShadow="md"
                      icon={<AddIcon />}
                      onClick={onOpen}
                    />
                    <AddStartModal
                      isOpen={isOpen}
                      onClose={onClose}
                      docRef={docRef}
                    />
                  </Box>
                  <Divider my={3} />

                  <FieldArray name="starts">
                    {(helper) =>
                      raceStarts?.map((item, idx) => {
                        const [start, setStart] = useState(
                          formatTime(item.start)
                        );

                        return (
                          <Box ml={2} mt={4} mb={3} key={idx}>
                            <FormLabel fontSize={12}>{item.fleet}</FormLabel>
                            <Field
                              key={idx}
                              name={`starts.${idx}.${item.fleet}`}
                              type="time"
                              step="2"
                              border="none"
                              onChange={(
                                e: React.FormEvent<HTMLInputElement>
                              ) => {
                                if (values.starts) {
                                  values.starts[idx].start =
                                    e.currentTarget.value;
                                }

                                setStart(e.currentTarget.value);
                              }}
                              value={start}
                              as={Input}
                            />
                            {/* <pre>{JSON.stringify(helper, null, 2)}</pre> */}
                          </Box>
                        );
                      })
                    }
                  </FieldArray>
                  <FormLabel htmlFor="notes">Notes</FormLabel>
                  <Field name="notes" as={Textarea} rows="4" cols="50">
                    {loading ? "loading..." : currentRace?.notes}
                  </Field>

                  <Button type="submit" colorScheme="blue" w="100%" my={4}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </FadeInSlideLeft>
      </Box>
    </Fragment>
  );
};
