import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
// Chakra
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SlideFade,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
// Firebase
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
//
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Field, Form, Formik } from "formik";
import PriBtn from "../../components/generic/PriBtn";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";

// Icons
import * as Yup from "yup";
import SecBtn from "../../components/generic/SecBtn";

export default function SeriesEdit({ setHeaderTitle, seriesId }) {
  setHeaderTitle("Edit Series");
  // Submit button appears on scroll
  const { isOpen, onToggle, onOpen } = useDisclosure();
  if (!window) {
    // setUserHasScrolled(true);
    onOpen();
  } else {
    window.onscroll = function () {
      // setUserHasScrolled(true);
      onOpen();
    };
  }
  // const [seriesId] = useStorage("seriesId");
  const [seriesName, setSeriesName] = useState("");
  // console.log("seriesName: ", seriesName);

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId);
  const [currentSeries, seriesLoading, error] = useDocumentData(docRef);

  useEffect(() => {
    console.log("currentSeries ", currentSeries);
  }, [currentSeries]);

  const submittedToast = useToast();

  const raceBasRequirements = {
    _seriesid: "",
    date: "",
    sailed: "0",
    fleet: "",
    start: [],
    time: "",
  };

  const submitHandler = async (values: any) => {
    // console.log("values.newFile: ", values.newFile);
    // console.log("values.addRaces: ", values.addRaces);
    if (values.newFile && values.addRaces) {
      // console.log("values.addRaces: ", values.addRaces);
      // addRaces is an int or null
      const racesRef = collection(docRef, "races");
      for (let i = 1; values.addRaces + 1 > i; i++) {
        // need to add raceBasRequirements
        addDoc(racesRef, {
          name: `${values.prefix} ${i}`,
          raceid: i,
          rank: i,
          ...raceBasRequirements,
        });
      }
    }
    // Remove undefined's
    Object.keys(values).forEach((key) =>
      values[key] === undefined ? delete values[key] : {}
    );
    // here we may need to add modified flag or something
    values.lastModified = serverTimestamp();
    values.newFile = false;
    // update the firestore doc
    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Series Updated",
      description: "Your series properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // route back to previous page
    history.back();
    // route("/races", true);
  };

  useEffect(() => {
    if (!seriesLoading) {
      setSeriesName(currentSeries && currentSeries.event);
    }
  }, [currentSeries, seriesLoading]);

  const seriesEditSchema = Yup.object().shape({
    event: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    venue: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    eventemail: Yup.string().email("Invalid email"),
  });

  return (
    <Page>
      {currentSeries && seriesName && (
        <Formik
          initialValues={{
            event: currentSeries.event,
            name: seriesName, // shouldn't really be name
            newFile: true,
            addRaces: null,
            prefix: "Race ",
            eventwebsite: currentSeries.eventwebsite,
            eventburgee: currentSeries.eventburgee,
            eventemail: currentSeries.eventemail,
            venue: currentSeries.venue,
            venuewebsite: currentSeries.venuewebsite,
            venueburgee: currentSeries.venueburgee,
            venueemail: currentSeries.venueemail,
            fileName: currentSeries.__fileInfo.name,
            lastModified: currentSeries.__fileInfo.lastModified,
            lastModifiedDate: currentSeries.__fileInfo.lastModifiedDate,
            size: currentSeries.__fileInfo.size,
            resultType: currentSeries.resultType,
            rowTitle: currentSeries.rowTitle || "boat",
          }}
          // validationSchema={seriesEditSchema}
          onSubmit={submitHandler}
        >
          {({ isSubmitting, values, errors, touched }) => (
            <Form>
              <PageHead title={currentSeries.event} loading={seriesLoading}>
                <Box mr={4}>
                  <Text color={"blue.500"}>Public</Text>
                  <Switch
                    ml={1}
                    defaultChecked={currentSeries.__public}
                    onChange={async () => {
                      await updateDoc(docRef, {
                        __public: !currentSeries.__public,
                      });
                    }}
                  />
                </Box>
              </PageHead>

              <Box mb={3} mt={4}>
                {currentSeries.newFile && (
                  <Flex alignItems={"center"} gap={0} my={2}>
                    <FormLabel htmlFor="addRaces">#Races: </FormLabel>
                    <Field
                      name="addRaces"
                      type="number"
                      w={70}
                      mr={6}
                      as={Input}
                    />
                    <FormLabel htmlFor="prefix">Prefix: </FormLabel>
                    <Field name="prefix" as={Input} />
                    <Field
                      name="__fileInfo.newFile"
                      type="hidden"
                      value={false}
                      as={Input}
                    />
                  </Flex>
                )}

                <Accordion defaultIndex={[0]}>
                  {/* ///////////////////////////// */}
                  {/*// Series details ///////////  */}
                  <AccordionItem border="0px">
                    <AccordionButton
                      bgGradient="linear(to-r, whiteAlpha.100, blue.300)"
                      borderBottomRightRadius={15}
                      boxShadow={"md"}
                      _hover={{
                        bgGradient: "linear(to-r, whiteAlpha.100, blue.400)",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        Series details
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Field name="resultType">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor="resultType">
                              Default result type
                            </FormLabel>

                            <RadioGroup
                              {...field}
                              id="resultType"
                              colorScheme="blue"
                            >
                              <HStack>
                                <Field
                                  type="radio"
                                  name="resultType"
                                  value="points"
                                  as={Radio}
                                >
                                  Points
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
                                <Field
                                  type="radio"
                                  name="resultType"
                                  value="corrected"
                                  as={Radio}
                                >
                                  Corrected
                                </Field>
                              </HStack>
                            </RadioGroup>
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Divider my={3} />

                      <Field name="rowTitle">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor="resultType">
                              Default row title
                            </FormLabel>

                            <RadioGroup
                              {...field}
                              id="rowTitle"
                              colorScheme="blue"
                            >
                              <HStack>
                                <Field
                                  type="radio"
                                  name="rowTitle"
                                  value="boat"
                                  as={Radio}
                                >
                                  Boat
                                </Field>
                                <Field
                                  type="radio"
                                  name="rowTitle"
                                  value="helmname"
                                  as={Radio}
                                >
                                  Skipper
                                </Field>
                                <Field
                                  type="radio"
                                  name="rowTitle"
                                  value="sailno"
                                  as={Radio}
                                >
                                  Sail no.
                                </Field>
                              </HStack>
                            </RadioGroup>
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Divider my={3} />
                      <FormControl
                        isInvalid={(!!errors.venue as any) && touched.venue}
                      >
                        <FormLabel htmlFor="event">Series name</FormLabel>
                        <Field name="event" as={Input} />
                        <FormErrorMessage>{errors.venue}</FormErrorMessage>
                      </FormControl>

                      <Divider my={3} />
                      <FormControl
                        isInvalid={(!!errors.venue as any) && touched.venue}
                      >
                        <FormLabel htmlFor="venue">Venue</FormLabel>
                        <Field name="venue" as={Input} />
                        <FormErrorMessage>{errors.venue}</FormErrorMessage>
                      </FormControl>

                      <Divider my={3} />

                      <FormLabel htmlFor="eventwebsite">
                        Series website
                      </FormLabel>
                      <Field name="eventwebsite" as={Input} />

                      <Divider my={3} />

                      <FormLabel htmlFor="eventemail">Series email</FormLabel>
                      <Field name="eventemail" as={Input} />

                      <Divider my={3} />

                      <FormLabel htmlFor="eventburgee">Series burgee</FormLabel>
                      <Field name="eventburgee" as={Input} />

                      <Divider my={3} />

                      <Flex justifyContent={"space-between"}>
                        <Text>Event Id: </Text>
                        <Text color={"gray.400"}>{currentSeries.eventeid}</Text>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* ///////////////////////////// */}
                  {/*// Venue details ////////////  */}
                  <AccordionItem border="0px" mt={2}>
                    <AccordionButton
                      bgGradient="linear(to-r, whiteAlpha.100, blue.300)"
                      borderBottomRightRadius={15}
                      boxShadow={"md"}
                      _hover={{
                        bgGradient: "linear(to-r, whiteAlpha.100, blue.400)",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        Venue details
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <FormLabel htmlFor="venue">Venue</FormLabel>
                      <Field name="venue" as={Input} />

                      <Divider mt={3} />

                      <FormLabel htmlFor="venuewebsite">
                        Venue website
                      </FormLabel>
                      <Field name="venuewebsite" as={Input} />

                      <Divider mt={3} />

                      <FormLabel htmlFor="venueemail">Venue email</FormLabel>
                      <Field name="venueemail" as={Input} />

                      <Divider mt={3} />

                      <FormLabel htmlFor="venueburgee">Venue burgee</FormLabel>
                      <Field name="venueburgee" as={Input} />
                    </AccordionPanel>
                  </AccordionItem>

                  {/* ///////////////////////////// */}
                  {/*// File properties //////////  */}
                  <AccordionItem border="0px" mt={2}>
                    <AccordionButton
                      bgGradient="linear(to-r, whiteAlpha.100, blue.300)"
                      borderBottomRightRadius={15}
                      boxShadow={"md"}
                      _hover={{
                        bgGradient: "linear(to-r, whiteAlpha.100, blue.400)",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        File properties
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel pb={4}>
                      <FormLabel htmlFor="fileName">File name</FormLabel>
                      <Field name="fileName" as={Input} />

                      <Divider mt={3} />

                      <FormLabel htmlFor="lastModified">
                        Last Modified
                      </FormLabel>
                      {/* <Field name="lastModified" as={Text} /> */}
                      <Text px={4}>
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(currentSeries.__fileInfo.lastModified)}
                      </Text>

                      <Divider mt={3} />

                      <FormLabel htmlFor="lastModifiedDate">
                        Last Modified Date
                      </FormLabel>
                      <Text px={4}>
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(currentSeries.__fileInfo.lastModifiedDate)}
                        {/* {currentSeries.__fileInfo.lastModifiedDate} */}
                      </Text>

                      <Divider mt={3} />

                      <FormLabel htmlFor="size">Size</FormLabel>
                      {/* <Field name="size" as={Input} /> */}
                      <Text px={4}>{currentSeries.__fileInfo.size}</Text>

                      {/* <Divider mt={3} /> */}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>

                <Divider my={3} />

                {/* Submit Button */}
                <SecBtn type="reset">Reset</SecBtn>
                <SlideFade in={isOpen} offsetX="20px">
                  <Box m={4} position="fixed" bottom={0} right={0}>
                    <PriBtn
                      type="submit"
                      px={8}
                      leftIcon={(<SaveOutlinedIcon />) as any}
                      borderRadius="full"
                      isLoading={isSubmitting}
                      loadingText="Saving"
                    >
                      Save
                    </PriBtn>
                  </Box>
                </SlideFade>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Page>
  );
}
