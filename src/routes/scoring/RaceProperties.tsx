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
  useToast
} from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import { doc, updateDoc } from "firebase/firestore";
import { Field, FieldArray, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { formatTime } from "../../util/formatters";


export const RaceProperties = (props) => {

  interface IcurrentRace {
    // Let it all go
    [key: string | number]: any;
  }

  interface IraceStarts {
    fleet: string;
    start: string;
  }

  // const [currentRace, setCurrentRace] = useState<IcurrentRace>({
  //   rank: "1",
  // });
 const [seriesId] = useStorage('seriesId')
 const [raceId] = useStorage('raceId')


  const [raceTime, setRaceTime] = useState<string>();
  const [raceDate, setRaceDate] = useState<any>();
  const [raceSailed, setRaceSailed] = useState<any>();
  const [raceStarts, setRaceStarts] = useState<IraceStarts[]>();
  const [postponed, setPostponed] = useState<string>("");
  const [postponedDate, setPostponedDate] = useState("");

  const submittedToast = useToast();

  // Need this for the AddStartModal

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId, "races", raceId);
  const [currentRace, loading, error] = useDocumentData(docRef);

  if (!loading) {
    setRaceTime(formatTime(currentRace?.time));
    setRaceStarts(currentRace?.starts);
    setPostponedDate(currentRace?.postponedDate);
  }

  const submitHandler = async (values: any) => {
    console.log("values: ", values);

    // not sure i need this
    // remove undefined's from values
    Object.keys(values).map((m) => {
      if (values[m] === undefined) return (values[m] = "");
      return values;
    });
    // update the firestore doc
    // here we may need to add modified flag or something
    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Race Updated",
      description: "Your race properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // route back to races
    route("/races");
  };

  return (
    <Fragment>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          {/* This is the header with race name or number */}
          <Heading as="h5" color="blue.400">
            {currentRace?.name ? currentRace.name : `Race ${currentRace?.rank}`}
          </Heading>
          <Text fontSize="sm" color="lightgray">
            id: {currentRace?.raceid}
          </Text>
        </Flex>
        <Divider my={3} />
        <Box mx={4}>
          <Formik
            enableReinitialize
            initialValues={{
              resultType: "finish",
              date: raceDate,
              sailed: raceSailed,
              time: raceTime,
              starts: raceStarts,
            }}
            onSubmit={submitHandler}
          >
            {({ values }) => (
              <Form>
                <Field name="resultType">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                      <FormLabel htmlFor="resultType">Scoring type</FormLabel>
                      <RadioGroup {...field} id="resultType" colorScheme="blue">
                        <HStack>
                          <Field type="radio" name="resultType" value="position" as={Radio}>
                            Position
                          </Field>
                          <Field type="radio" name="resultType" value="elapsed" as={Radio}>
                            Elapsed
                          </Field>
                          <Field type="radio" name="resultType" value="finish" as={Radio}>
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
                <Box d="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <FormControl>
                      <FormLabel htmlFor="date">Date: </FormLabel>
                      <Field type="date" name="date" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormLabel htmlFor="sailed">Sailed</FormLabel>
                    <Field name="sailed" type="checkbox" colorScheme="blue" isChecked={raceSailed} as={Checkbox} />
                  </Box>
                </Box>

                <Divider my={3} />

                {/* First gun  */}
                <FormLabel htmlFor="time">First gun</FormLabel>
                <Box d="flex" justifyContent="space-between">
                  {/* Need to get seconds here */}
                  <Field name="time" type="time" step="2" as={Input} border="none" />
                  <Button
                    colorScheme="gray"
                    px={8}
                    ml={4}
                    onClick={(e) => {
                      const theDate = Temporal.Now.plainTimeISO();
                      setRaceTime(theDate.round("minutes").toString());
                    }}
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
                    // colorScheme="blue"
                    // size="xs"
                    icon={<AddIcon />}
                    onClick={(e) => {
                      console.log("e: ", e);
                    }}
                  />
                </Box>
                <Divider my={3} />

                <FieldArray name="starts">
                  {(helper) =>
                    raceStarts?.map((item, idx) => {
                      const [start, setStart] = useState(formatTime(item.start));

                      return (
                        <Box ml={2} mt={4} mb={3} key={idx}>
                          <FormLabel fontSize={12}>{item.fleet}</FormLabel>
                          <Field
                            key={idx}
                            name={`starts.${idx}.${item.fleet}`}
                            type="time"
                            step="2"
                            border="none"
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                              if (values.starts) {
                                values.starts[idx].start = e.currentTarget.value;
                              }

                              // values[key] = val;
                              setStart(e.currentTarget.value);
                              // return { key, val };
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

                <Button type="submit" colorScheme="blue" w="100%" my={4}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Fragment>
  );
};
