import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
// import { style } from "@mui/system";
import {
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { h, Fragment } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { BsXLg } from "react-icons/bs";
import {
  MdModeEdit,
  MdOutlineAddToPhotos,
  MdOutlineFileUpload,
} from "react-icons/md";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import style from "./style.css";
import { db } from "../../util/firebase-config";
import AddSeriesModal from "./AddSeriesModal";

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
          <Tooltip
            label="Upload file"
            hasArrow
            bg="blue.300"
            placement="bottom-start"
          >
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

          <Tooltip
            label="Add Series"
            hasArrow
            bg="blue.300"
            placement="bottom-start"
          >
            <IconButton
              aria-label="add series"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              _visited={{ color: "blue" }}
              onClick={onOpen}
              icon={<MdOutlineAddToPhotos />}
            />
          </Tooltip>
        </FadeInSlideLeft>
        <AddSeriesModal isOpen={isOpen} onClose={onClose} eventId={eventId} />
      </Flex>

      <Divider mt={3} border="8px" />

      <List>
        {seriesLoading ? (
          <Flex justifyContent="center" alignItems="center" mt={8}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
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
                      <Tooltip
                        label="Edit Series"
                        hasArrow
                        bg="blue.300"
                        placement="bottom-start"
                      >
                        <IconButton
                          aria-label="edit series"
                          icon={<MdModeEdit />}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setSeriesId(series.id);
                            route("/series/edit");
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Delete Series"
                        hasArrow
                        bg="blue.300"
                        placement="bottom-start"
                      >
                        <IconButton
                          aria-label="Delete series"
                          icon={<BsXLg />}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={(e) => {
                            e.preventDefault();
                            removeSeries(series.id);
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Flex>

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
