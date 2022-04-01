import { Heading, Divider, List, ListItem, Text } from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../util/firebase-config";
import style from "./scoring.css";

export const EventsList = ({ user, setEvent }) => {
  // Get users events // should be just series

  const eventsRef = collection(db, "events");
  const [events] = useCollection(
    query(eventsRef, where("__owner", "==", user && user.uid))
  );

  return (
    <Fragment>
      <Heading as="h4">Select a series</Heading>
      <Divider />
      <List>
        {events?.docs.map((series) => (
          <Fragment>
            <ListItem
              key={series.id}
              className={style.seriesList}
              onClick={() => {
                setEvent(series.ref);
              }}
            >
              <Text>{series.data().event}</Text>
            </ListItem>
          </Fragment>
          // event={series.data().event} eventeid={series.data().eventeid}
        ))}
      </List>
    </Fragment>
  );
};
