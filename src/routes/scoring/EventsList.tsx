import { TriangleUpIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

export const EventsList = ({ user, setEvent }) => {
  // Get users events // should be just series
  const eventsRef = collection(db, "events");
  const [events] = useCollection(
    query(eventsRef, where("__owner", "==", user && user.uid))
  );
  const [seriesState, setSeriesState] = useStorage("seriesState", {
    initialValue: "",
    bool: false,
  });

  return (
    <Fragment>
      <Flex justifyContent="space-between" alignItems="end">
        <Heading as="h4" color="blue.400">
          Select an event
        </Heading>
        <Button
          colorScheme="blue"
          variant="outline"
          boxShadow="md"
          // leftIcon={<TriangleUpIcon />}
          _visited={{ color: "blue" }}
          onClick={() => route("/upload")}
        >
          Upload
        </Button>
      </Flex>
      <Divider mt={3} border="8px" />
      <List>
        {events?.docs.map((series) => (
          // {{{console.log()}}}
          <Fragment>
            <ListItem
              key={series.id}
              className="selectList"
              // as="a"

              onClick={() => {
                setSeriesState(JSON.stringify(series.ref));
                console.log("series: ", seriesState);
                route(`/scoring/${series.id}`);
              }}
            >
              <Flex justifyContent="space-between">
                <Text>{series.data().event}</Text>
                <Text fontSize="xs" color="gray.400">
                  {/* {Temporal.Instant.from(series.data().__fileInfo.lastModified)} */}
                </Text>
              </Flex>

              <Text fontSize="xs" color="gray.400">
                {series.data().venue}
              </Text>
            </ListItem>
          </Fragment>
          //
          // event={series.data().event} eventeid={series.data().eventeid}
        ))}
      </List>
    </Fragment>
  );
};
