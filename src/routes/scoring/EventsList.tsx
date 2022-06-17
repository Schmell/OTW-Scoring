import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { collection, deleteDoc, doc, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import { BsXLg } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import style from "./scoring.css";

export const EventsList = ({ user, setHeaderTitle }) => {
  setHeaderTitle("Events list");
  // Get users events // should be just series
  const eventsRef = collection(db, "events");
  const [events, eventsLoading] = useCollection(
    query(eventsRef, where("__owner", "==", user && user.uid))
  );

  const removeSeries = async (id: any) => {
    console.log("id: ", id);
    await deleteDoc(doc(db, "events", id));
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

        {/* Upload Button */}
        <FadeInSlideLeft>
          <Button
            colorScheme="blue"
            variant="outline"
            boxShadow="md"
            _visited={{ color: "blue" }}
            onClick={() => route("/upload")}
          >
            Upload
          </Button>
        </FadeInSlideLeft>
      </Flex>

      <Divider my={3} />

      <List>
        {eventsLoading ? (
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
          events?.docs.map((series) => (
            <Fragment>
              <FadeInSlideLeft>
                <ListItem
                  key={series.id}
                  className={style.selectList}
                  onClick={() => {
                    setSeriesId(series.id);
                    route("/races");
                  }}
                >
                  <Flex justifyContent="space-between">
                    <Text>{series.data().event}</Text>
                    <Text fontSize="xs" color="gray.400"></Text>
                    <IconButton
                      aria-label="Remove series"
                      icon={<MdClear />}
                      size={"sm"}
                      variant="ghost"
                      colorScheme={"blue"}
                      onClick={() => {
                        console.log("series.data(): ", series.id);
                        removeSeries(series.id);
                      }}
                    />
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
