import {
  Box,
  Flex,
  Heading,
  Divider,
  FormLabel,
  RadioGroup,
  Radio,
  FormControl,
  Input,
  FormErrorMessage,
  Checkbox,
  Button,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { getDoc, updateDoc } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { formatDate, formatTime } from "../../util/formatters";
import { Temporal } from "@js-temporal/polyfill";
import { AddIcon } from "@chakra-ui/icons";
// This should become the race roperties form
// User/Series properties should dictate scoring type
// ie: finish time, elapesd or place
// RacePropertiesForm
export const ScoringSetUp = ({ event, race, setRaceProperties }) => {
  // This form should set up the race
  // Scoring style. ie: rank , elapsed, finish, maybe even corrected
  // Date/time maybe can be adjusted *time bieng first
  // console.log("race: ", race);
  interface IcurrentRace {
    // Let it all go
    [key: string | number]: any;
  }

  interface IraceStarts {
    fleet: string;
    start: string;
  }

  const [currentRace, setCurrentRace] = useState<IcurrentRace>({
    rank: "1",
  });

  const [raceTime, setRaceTime] = useState<any>();
  const [raceDate, setRaceDate] = useState<any>();
  const [raceSailed, setRaceSailed] = useState<any>();
  const [raceStarts, setRaceStarts] = useState<IraceStarts[]>();

  useEffect(() => {
    const currentRace = async () => {
      const r = await getDoc(race);
      const data = (await r.data()) as any;
      // const raceDate = Temporal.PlainDate.from(formatDate(data.date)!);
      setCurrentRace(data);
      setRaceTime(formatTime(data.time));
      setRaceDate(formatDate(data.date));
      setRaceSailed(+data.sailed); // Int
      setRaceStarts(data.starts);
    };
    currentRace();
  }, []);

  const submitHandler = async (values: any) => {
    // console.log("currentRace: ", race);
    console.log(values, null, 2);
    await updateDoc(race, values);
  };

  return (
    <Fragment>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          {/* This is the header with race name or number */}
          <Heading as="h5" color="blue.400">
            {currentRace.name ? currentRace.name : `Race ${currentRace.rank}`}
          </Heading>
          <Text fontSize="sm" color="lightgray">
            id: {currentRace.raceid}
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
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel htmlFor="resultType">Scoring type</FormLabel>
                      <RadioGroup {...field} id="resultType" colorScheme="blue">
                        <HStack>
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
                <Box
                  d="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <FormControl>
                      <FormLabel htmlFor="date">Date: </FormLabel>
                      <Field type="date" name="date" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormLabel htmlFor="sailed">Sailed</FormLabel>
                    <Field
                      name="sailed"
                      type="checkbox"
                      colorScheme="blue"
                      isChecked={raceSailed}
                      as={Checkbox}
                    />
                  </Box>
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
                    colorScheme="gray"
                    px={8}
                    ml={4}
                    onClick={(e) => {
                      const theDate = Temporal.Now.plainTimeISO();
                      setRaceTime(theDate.round("minutes"));
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
