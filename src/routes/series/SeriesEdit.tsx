import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
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
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { MdOutlineAddToPhotos, MdOutlineFileUpload } from "react-icons/md";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

const SeriesEdit = ({ setHeaderTitle }) => {
  setHeaderTitle("Edit Series");

  const [seriesId] = useStorage("seriesId");

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId);
  const [currentSeries, seriesLoading, error] = useDocumentData(docRef);
  const submittedToast = useToast();

  const submitHandler = async (values: any) => {
    Object.keys(values).forEach((key) => (values[key] === undefined ? delete values[key] : {}));
    // here we may need to add modified flag or something
    // values.__fileInfo.lastModified = Date.now();
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

    // route back to races
    route("/races");
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Edit Series
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <Tooltip label="Upload" hasArrow bgColor={"blue.300"} placement="bottom-start">
            <IconButton
              aria-label="upload"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              mr={2}
              _visited={{ color: "blue" }}
              onClick={() => route("/upload")}
              icon={<MdOutlineFileUpload />}
            />
          </Tooltip>

          <Tooltip label="Add Series" hasArrow bgColor={"blue.300"} placement="bottom-start">
            <IconButton
              aria-label="Add series"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              _visited={{ color: "blue" }}
              // onClick={() => route("/series/edit")}
              icon={<MdOutlineAddToPhotos />}
            />
          </Tooltip>
        </FadeInSlideLeft>
      </Flex>

      <Divider my={3} border="8px" />

      <Box>
        {currentSeries && (
          <Formik
            initialValues={{
              event: currentSeries.event,
              eventwebsite: currentSeries.eventwebsite,
              eventburgee: currentSeries.eventburgee,
              eventemail: currentSeries.eventemail,
              venue: currentSeries.venue,
              venuewebsite: currentSeries.venuewebsite,
              venueburgee: currentSeries.venueburgee,
              venueemail: currentSeries.venueemail,
              name: currentSeries.__fileInfo.name,
              lastModified: currentSeries.__fileInfo.lastModified,
              lastModifiedDate: currentSeries.__fileInfo.lastModifiedDate,
              size: currentSeries.__fileInfo.size,
              resultType: currentSeries.resultType,
              rowTitle: currentSeries.rowTitle,
            }}
            onSubmit={submitHandler}
          >
            <Form>
              <Accordion>
                <AccordionItem>
                  <Text as={"h2"} mb={3}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Series details
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4}>
                    <Flex justifyContent={"space-between"}>
                      <Text>Event Id: </Text>
                      <Text color={"gray.400"}>{currentSeries.eventeid}</Text>
                    </Flex>

                    <Divider my={3} />

                    {/* <FormLabel htmlFor="resutlType">Series name</FormLabel> */}
                    <Field name="resultType">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="resultType">Default result type</FormLabel>

                          <RadioGroup {...field} id="resultType" colorScheme="blue">
                            <HStack>
                              <Field type="radio" name="resultType" value="points" as={Radio}>
                                Position
                              </Field>
                              <Field type="radio" name="resultType" value="elapsed" as={Radio}>
                                Elapsed
                              </Field>
                              <Field type="radio" name="resultType" value="finish" as={Radio}>
                                Finishes
                              </Field>
                              <Field type="radio" name="resultType" value="corrected" as={Radio}>
                                Corrected
                              </Field>
                            </HStack>
                          </RadioGroup>
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Divider my={3} />

                    {/* <FormLabel htmlFor="resutlType">Series name</FormLabel> */}
                    <Field name="rowTitle">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="resultType">Default row title</FormLabel>

                          <RadioGroup {...field} id="rowTitle" colorScheme="blue">
                            <HStack>
                              <Field type="radio" name="rowTitle" value="boat" as={Radio}>
                                Boat
                              </Field>
                              <Field type="radio" name="rowTitle" value="helmname" as={Radio}>
                                Helm
                              </Field>
                              <Field type="radio" name="rowTitle" value="sailno" as={Radio}>
                                Sail no.
                              </Field>
                            </HStack>
                          </RadioGroup>
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Divider my={3} />

                    <FormLabel htmlFor="event">Series name</FormLabel>
                    <Field name="event" as={Input} />

                    <Divider my={3} />

                    <FormLabel htmlFor="eventwebsite">Series website</FormLabel>
                    <Field name="eventwebsite" as={Input} />

                    <Divider my={3} />

                    <FormLabel htmlFor="eventemail">Series email</FormLabel>
                    <Field name="eventemail" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="eventburgee">Series burgee</FormLabel>
                    <Field name="eventburgee" as={Input} />

                    <Divider mt={3} />
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <Text as={"h2"} mb={3}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Venue details
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4}>
                    <FormLabel htmlFor="venue">Venue</FormLabel>
                    <Field name="venue" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="venuewebsite">Venue website</FormLabel>
                    <Field name="venuewebsite" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="venueemail">Venue email</FormLabel>
                    <Field name="venueemail" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="venueburgee">Venue burgee</FormLabel>
                    <Field name="venueburgee" as={Input} />
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <Text as={"h2"} mb={3}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        File properties
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4}>
                    <FormLabel htmlFor="name">File name</FormLabel>
                    <Field name="name" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="lastModified">Last Modified</FormLabel>
                    <Field name="lastModified" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="lastModifiedDate">Last Modified Date</FormLabel>
                    <Field name="lastModifiedDate" as={Input} />

                    <Divider mt={3} />

                    <FormLabel htmlFor="size">Size</FormLabel>
                    <Field name="size" as={Input} />

                    <Divider mt={3} />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              {/* Submit Button */}
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

export default SeriesEdit;
