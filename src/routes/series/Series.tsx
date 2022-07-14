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
} from "@chakra-ui/react";
import { collection, deleteDoc, doc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import style from "./style.css";
// Icons
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const Series = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Series");
  // Get users series
  const seriesRef = collection(db, "series");
  const [series, seriesLoading] = useCollection(query(seriesRef, where("__owner", "==", user && user.uid)));
  //   console.log("series: ", series?.docs);

  const removeSeries = async (id: any) => {
    // Uses cloud function to remove any sub-collections
    await deleteDoc(doc(db, "series", id));
  };

  // useStorage option (modified to be used as context)
  const [seriesId, setSeriesId] = useStorage("seriesId", {
    initVal: "",
    bool: false,
  });

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
          <Tooltip label="Import file" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="import"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              mr={2}
              _visited={{ color: "blue" }}
              onClick={() => route("/import")}
              icon={<Icon as={FileUploadOutlinedIcon} />}
            />
          </Tooltip>

          <Tooltip label="Add Series" hasArrow bg="blue.300" placement="bottom-start">
            <IconButton
              aria-label="add series"
              colorScheme="blue"
              variant="outline"
              boxShadow="md"
              _visited={{ color: "blue" }}
              // onClick={() => route("/series/edit")}
              icon={<Icon as={AddToPhotosOutlinedIcon} />}
            />
          </Tooltip>
        </FadeInSlideLeft>
      </Flex>

      <Divider mt={3} />

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
                      cursor={"pointer"}
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
                      <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                        <IconButton
                          aria-label="edit series"
                          icon={<Icon as={EditIcon} />}
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
                          icon={<Icon as={CloseIcon} />}
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

export default Series;
