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
  useDisclosure,
} from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import { doc, updateDoc } from "firebase/firestore";
import { Field, FieldArray, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { formatDate, formatTime } from "../../util/formatters";
import { AddStartModal } from "./RaceProperties/AddStartModal";


export const RaceProperties = (props) => {
  interface IraceStarts {
    fleet: string;
    start: string;
  }

  const [raceTime, setRaceTime] = useState<string>();
  const [raceDate, setRaceDate] = useState<any>();
  const [raceSailed, setRaceSailed] = useState<any>();
  const [raceStarts, setRaceStarts] = useState<IraceStarts[]>();
  const [raceId, setRaceId] = useStorage('raceId') // not sure if we need
  const [seriesId, setSeriesId] = useStorage('seriesId')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const docRef = doc(db, "events", seriesId, 'races', raceId)
  const [currentRace, loading, error] = useDocumentData(docRef);
  if (error) throw error
  if(!loading){
    setRaceTime(formatTime(currentRace?.time));
    setRaceDate(formatDate(currentRace?.date));
    setRaceSailed(+currentRace?.sailed); // Int
    setRaceStarts(currentRace?.starts);

  }

  const submitHandler = async (values: any) => {
    // console.log(values);
    await updateDoc(docRef, values)
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
                    icon={<AddIcon />}
                    onClick={onOpen}
                  />
                  <AddStartModal isOpen={isOpen} onClose={onClose} docRef={docRef}/>
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
