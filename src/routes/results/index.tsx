import { Fragment, FunctionalComponent, h } from "preact";
import style from "./style.css";
import { useState } from "preact/compat";
import { collection, query, where } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  // FormGroup,
  Input,
  Checkbox,
  Button,
  Heading,
  RadioGroup,
  Stack,
  Radio,
  Divider,
  Text,
  Container,
  ButtonGroup,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import { Link } from "preact-router";
import classNames from "classnames";
// import List from "preact-material-components/List";
// import "preact-material-components/List/style.css";

const Results: FunctionalComponent = () => {
  const eventRef = collection(db, "events");
  const [events] = useCollection(eventRef);
  const [event, setEvent] = useState<string | null>();
  const [race, setRace] = useState<string>("1");

  // next step is not to get comps rather display race results
  // or start un-sailed race with the comps
  const [results, setResults] = useState<string | null>();
  // console.log("results: ", results);

  // console.log("event: ", event);
  const racesQuery = query(collection(db, `events/${event}/races`));
  const [races] = useCollectionData(racesQuery);

  const resultsQuery = query(
    collection(db, `events/${event}/results`),
    where("raceid", "==", race)
  );
  const [theRace] = useCollectionData(resultsQuery);
  console.log("theRace: ", theRace);
  // console.log("races: ", races);
  // const isSailed = {
  //   sailed: race.sailed
  // }
  // const raceLinkClass = classNames(style,[
  // isSailed
  // ]
  // );
  return (
    <Fragment>
      <Heading>Series</Heading>
      <Button as="a" className={style.active} href="/upload">
        Upload
      </Button>
      <List>
        {events &&
          events.docs.map((item) => (
            <ListItem key={item.id}>
              <a
                href="#"
                className={style.seriesList}
                onClick={() => {
                  setEvent(item.id);
                }}
              >
                {item.data().event}
              </a>
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
