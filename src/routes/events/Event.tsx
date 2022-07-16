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
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import AddSeriesModal from "./AddSeriesModal";
import style from "./style.css";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { AreYouSure } from "../../components/generic/AreYouSure";

const EventList = ({ setHeaderTitle }) => {
  setHeaderTitle("Events Series");

  const [eventId] = useStorage("eventId");
  console.log("eventId: ", eventId);
  const [seriesId, setSeriesId] = useStorage("seriesId");

  const colRef = collection(db, "series");
  const seriesQuery = query(colRef, where("__event", "==", eventId));

  const [series, seriesLoading] = useCollection(seriesQuery);

  const removeSeries = async (id: any) => {
    // Uses cloud function to remove any sub-collections
    await updateDoc(doc(db, "series", id), { __event: "" });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteEventDisclosure = useDisclosure();

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            Select series
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <Tooltip label="Upload file" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="upload"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              mr={2}
              _visited={{ color: "blue" }}
              onClick={() => route("/upload")}
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
        </FadeInSlideLeft>
        <AddSeriesModal isOpen={isOpen} onClose={onClose} eventId={eventId} />
      </Flex>

      <Divider mt={3} border="8px" />

      <List>
        {seriesLoading ? (
          <Flex justifyContent="center" alignItems="center" mt={8}>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Flex>
        ) : (
          series?.docs.map((series) => (
            <Fragment>
              <FadeInSlideLeft>
                <ListItem key={series.id} className={style.selectList}>
                  <Flex justifyContent="space-between">
                    <Box
                      w="80%"
                      cursor="pointer"
                      onClick={() => {
                        setSeriesId(series.id);
                        route("/races");
                      }}
                    >
                      <Text>{series.data().event}</Text>

                      <Text fontSize="xs" color="gray.400">
                        {series.id}
                      </Text>
                    </Box>

                    <Box>
                      <Tooltip label="Edit Event" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="edit Event"
                          icon={(<Icon as={EditIcon} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setSeriesId(series.id);
                            route("/series/edit");
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Event" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="Delete Event"
                          icon={(<Icon as={CloseIcon} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={deleteEventDisclosure.onOpen}
                        />
                      </Tooltip>
                    </Box>
                  </Flex>
                  <AreYouSure disclosure={deleteEventDisclosure} callback={removeSeries} itemId={series.id} risk="low">
                    <Box>You can always add this back if you want</Box>
                  </AreYouSure>
                  <Text fontSize="xs" color="gray.400">
                    {series.data().venue}
                  </Text>
                </ListItem>
              </FadeInSlideLeft>
            </Fragment>
          ))
        )}
      </List>
    </Fragment>
  );
};

export default EventList;
