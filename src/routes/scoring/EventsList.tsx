import {
  Button,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text
} from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useCollection } from "react-firebase-hooks/firestore";
import useFireState from "../../hooks/useFireState";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

export const EventsList = (props) => {
  // console.log(props);
  // const [val, setVal] = useFireState('racePath')
  const [seriesId, setSeriesId] = useStorage('seriesId', {initVal:"hey", bool:false})
  // console.log('val: ', val);
  const eventsRef = collection(db, "events");
  const [events] = useCollection(
    query(eventsRef, where("__owner", "==", props.user && props.user.uid))
  );

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
          onClick={() => route("/upload")}
        >
          Upload
        </Button>
      </Flex>
      <Divider mt={3} border="8px" />
      <List>
        {events?.docs.map((series) => (
          <Fragment>
            <ListItem
              key={series.id}
              className="selectList"
              onClick={() => {
                // props.setEventPath(series.id)
                // console.log('series.id: ', series.id);
                setSeriesId(series.id)
                route(`/races`);
                }
              }
            >
              <Flex justifyContent="space-between">
                <Text>{series.data().event}</Text>
                <Text fontSize="xs" color="gray.400">
                </Text>
              </Flex>

              <Text fontSize="xs" color="gray.400">
                {series.data().venue}
              </Text>
            </ListItem>
          </Fragment>
          //
        ))}
      </List>
    </Fragment>
  );
};


