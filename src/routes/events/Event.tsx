import { h, Fragment } from "preact";
import { route } from "preact-router";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { collection, doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import AddSeriesModal from "./AddSeriesModal";
import style from "./style.css";
// Icons
import EditIcon from "@mui/icons-material/EditOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { AreYouSure } from "../../components/generic/AreYouSure";

const EventList = ({ setHeaderTitle }) => {
  setHeaderTitle("Event");

  const [eventId] = useStorage("eventId");
  const [_seriesId, setSeriesId] = useStorage("seriesId");

  const colRef = collection(db, "series");
  const seriesQuery = query(colRef, where("__event", "==", eventId));

  const [series, seriesLoading] = useCollection(seriesQuery);

  const removeSeries = async (id: any) => {
    // Uses cloud function to remove any sub-collections
    await updateDoc(doc(db, "series", id), { __event: "" });
  };
  const docRef = doc(db, "events", eventId);
  const [eventDoc, eventDocLoading] = useDocumentData(docRef);
  console.log("eventDoc: ", eventDoc);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteEventDisclosure = useDisclosure();

  return (
    <Fragment>
      {!eventDocLoading && eventDoc && (
        <Fragment>
          <Flex justifyContent="space-between" alignItems="end" px={4}>
            <FadeInSlideRight>
              <Heading as="h4" color="blue.400">
                {eventDoc.name}
              </Heading>
            </FadeInSlideRight>

            {/* Sub header buttons */}
            <FadeInSlideLeft>
              <Flex>
                <Tooltip label="Upload file" hasArrow bg="blue.300" placement="bottom-start">
                  <IconButton
                    aria-label="upload"
                    colorScheme="blue"
                    variant="outline"
                    boxShadow="md"
                    mr={2}
                    _visited={{ color: "blue" }}
                    onClick={() => route("/import")}
                    icon={(<Icon as={FileUploadOutlinedIcon} />) as any}
                  />
                </Tooltip>

                <Tooltip label="Add Series" hasArrow bg="blue.300" placement="bottom-start">
                  <IconButton
                    aria-label="add series"
                    colorScheme="blue"
                    variant="outline"
                    boxShadow="md"
                    _visited={{ color: "blue" }}
                    onClick={onOpen}
                    icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
                  />
                </Tooltip>
              </Flex>
            </FadeInSlideLeft>

            <AddSeriesModal isOpen={isOpen} onClose={onClose} eventId={eventId} />
          </Flex>

          <Divider my={3} border={2} shadow={"md"} />

          <List px={4}>
            {seriesLoading ? (
              <Flex justifyContent="center" alignItems="center" mt={8}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Flex>
            ) : (
              series?.docs.map((series) => (
                <Fragment>
                  <FadeInSlideLeft>
                    <ListItem key={series.id} py={4} borderRightRadius={8} shadow={"md"} my={6}>
                      <Flex justifyContent="space-between">
                        <Box
                          w="80%"
                          mx={2}
                          cursor="pointer"
                          onClick={() => {
                            setSeriesId(series.id);
                            route("/races");
                          }}
                        >
                          <Text fontSize="lg">{series.data().event}</Text>

                          <Text fontSize="lg" colorScheme={"gray"}>
                            {series.data().venue}
                          </Text>
                          <Text fontSize="sm" colorScheme={"blue"}>
                            <a href={series.data().venuewebsite}>{series.data().venuewebsite}</a>
                          </Text>
                        </Box>

                        <Flex gap={1}>
                          <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                            <IconButton
                              aria-label="edit series"
                              icon={(<Icon as={EditIcon} boxSize={7} />) as any}
                              variant="ghost"
                              colorScheme={"blue"}
                              onClick={() => {
                                setSeriesId(series.id);
                                route("/series/edit");
                              }}
                            />
                          </Tooltip>
                          <Tooltip label="Remove Series from Event" hasArrow bg="blue.300" placement="bottom-start">
                            <IconButton
                              aria-label="Remove Series from Event"
                              icon={(<Icon as={CloseIcon} boxSize={7} />) as any}
                              variant="ghost"
                              colorScheme={"blue"}
                              onClick={deleteEventDisclosure.onOpen}
                            />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </ListItem>
                  </FadeInSlideLeft>
                  <Divider mx={2} />
                  <AreYouSure disclosure={deleteEventDisclosure} callback={removeSeries} itemId={series.id} risk="low">
                    <Box>You can always add this back if you want</Box>
                  </AreYouSure>
                </Fragment>
              ))
            )}
          </List>
        </Fragment>
      )}
    </Fragment>
  );
};

export default EventList;
