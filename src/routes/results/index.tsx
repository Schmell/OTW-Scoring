import { Button, Heading, List, ListItem } from "@chakra-ui/react";
import classNames from "classnames";
import { collection, query, where } from "firebase/firestore";
import { Fragment, FunctionalComponent, h } from "preact";
import { useState } from "preact/compat";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import style from "./style.css";

const Results: FunctionalComponent = () => {
  const eventRef = collection(db, "events");
  const [events] = useCollection(eventRef);
  const [event, setEvent] = useState<string | null>();
  // const [race, setRace] = useState<string>("1");

  // const [results, setResults] = useState<string | null>();

  const racesQuery = query(collection(db, `events/${event}/races`));
  const [races] = useCollectionData(racesQuery);

  // const resultsQuery = query(
  //   collection(db, `events/${event}/results`),
  //   where("raceid", "==", race)
  // );
  // const [theRace] = useCollectionData(resultsQuery);
  // console.log("theRace: ", theRace);

  return (
    <Fragment>
      <Heading>Series</Heading>
      <Button as="a" href="/upload">
        Upload
      </Button>
      <List>
        {events &&
          events.docs.map((item) => (
            <ListItem
              key={item.id}
              className="selectList"
              onClick={() => {
                setEvent(item.id);
              }}
            >
              {item.data().event}
            </ListItem>
          ))}
      </List>

      <List>
        {races?.map((race) => (
          <ListItem
            className={classNames(style.raceSpan, [
              race.sailed === "1" ? style.sailed : null,
            ])}
          >
            <a
              href={`/results/${race._seriesid}/${race.raceid}`}
              data-key={event}
            >
              {race.rank} {race.name ? " - " + race.name : null}
            </a>
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
};

export default Results;
