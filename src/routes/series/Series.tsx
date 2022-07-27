import { Fragment, h } from "preact";
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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import { AreYouSure } from "../../components/generic/AreYouSure";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthState } from "react-firebase-hooks/auth";

const Series = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Series");
  // Get users series
  const seriesRef = collection(db, "series");
  const [series, seriesLoading] = useCollection(query(seriesRef, where("__owner", "==", user && user.uid)));
  const deleteSeriesDisclosure = useDisclosure();
  // const [user] = useAuthState(auth)

  // useStorage option (modified to be used as context)
  const [_seriesId, setSeriesId] = useStorage("seriesId", {
    initVal: "",
    bool: false,
  });

  const addSeriesHandler = async () => {
    let __fileInfo = {
      lastModifiedDate: new Date().toLocaleDateString("en-UK"),
      lastModified: new Date().toTimeString(),
    };
    const docRef = await addDoc(seriesRef, {
      name: "Series ",
      __fileInfo,
      __owner: user.uid,
    });
    setSeriesId(docRef.id);
    route("/series/edit");
  };

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end" px={4}>
        <FadeInSlideRight>
          <Heading as="h4" color="blue.400">
            All Series
          </Heading>
        </FadeInSlideRight>

        {/* Sub header buttons */}
        <FadeInSlideLeft>
          <Tooltip label="Import file" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="import"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              mr={2}
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
              icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
              onClick={addSeriesHandler}
            />
          </Tooltip>
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={4} border={4} />

      <List px={4}>
        {seriesLoading ? (
          <Flex justifyContent="center" alignItems="center" mt={8}>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Flex>
        ) : (
          series?.docs.map((series) => (
            <Fragment>
              <FadeInSlideLeft>
                <ListItem
                  key={series.id}
                  p={4}
                  my={6}
                  borderWidth="1px"
                  borderBottomWidth={4}
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  borderBottomRightRadius={18}
                  shadow={"md"}
                >
                  <Flex justifyContent="space-between">
                    <Box
                      w="80%"
                      mx={2}
                      cursor={"pointer"}
                      onClick={() => {
                        setSeriesId(series.id);
                        route("/races");
                      }}
                    >
                      <Text fontSize={"xl"}>{series.data().event}</Text>
                      <Text fontSize="lg" color={useColorModeValue("gray.500", "gray.300")}>
                        {series.data().venue}
                      </Text>

                      <Text fontSize="md" color={useColorModeValue("gray.500", "gray.300")}>
                        {series.data().venuewebsite}
                      </Text>
                    </Box>

                    <Flex gap={3}>
                      <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="edit series"
                          icon={(<Icon as={EditIcon} boxSize={7} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={() => {
                            setSeriesId(series.id);
                            route("/series/edit");
                          }}
                        />
                      </Tooltip>

                      <Tooltip label="Delete Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="Delete series"
                          icon={(<Icon as={CloseIcon} boxSize={7} />) as any}
                          size={"sm"}
                          variant="ghost"
                          colorScheme={"blue"}
                          onClick={deleteSeriesDisclosure.onOpen}
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <AreYouSure disclosure={deleteSeriesDisclosure} colPath="series" itemId={series.id}>
                    <Box>This will delete the series and is not undo-able</Box>
                    <Box>You will loose any work you have done with this Series</Box>
                  </AreYouSure>
                </ListItem>
              </FadeInSlideLeft>
            </Fragment>
          ))
        )}
      </List>
    </Fragment>
  );
};

export default Series;
