import {
  collection,
  DocumentSnapshot,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
// import { CheckCircleIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { Fragment, FunctionalComponent, h } from "preact";
import { Box } from "@chakra-ui/react";
// import List from "preact-material-components/List";
// import "preact-material-components/List/style.css";
// import "preact-material-components/Typography/style.css";
import { useEffect, useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../util/firebase-config";

import { RacesList } from "./scoring/RacesList";
import { ScoringSetUp } from "./scoring/ScoringSetup";
import { EventsList } from "./scoring/EventsList";
// import { ListItem } from "preact-material-components/List";

const Scoring: FunctionalComponent = () => {
  // This should be the entry point to the scoring app
  // Maybe we can figure out scoring system from series data (ie: postion, finish, etc..)
  // This pagge should probably heve a way to select the race you wanna score
  //
  const [user] = useAuthState(auth);
  const [event, setEvent] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [raceProperties, setRaceProperties] = useState<string | null>();

  // useEffect(() => {
  //   const eventStateStorage = window.localStorage.getItem("scoringEventState");
  //   console.log("eventStateStorage: ", JSON.parse(eventStateStorage!));
  //   if (eventStateStorage && eventStateStorage != "") {
  //     setEvent(JSON.parse(eventStateStorage));
  //   }

  //   const raceStateStorage = window.localStorage.getItem("scoringRaceState");
  //   if (raceStateStorage) {
  //     console.log("raceStateStorage: ", JSON.parse(raceStateStorage));
  //     setRace(JSON.parse(raceStateStorage));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (event) {
  //     window.localStorage.setItem("scoringEventState", JSON.stringify(event));
  //     console.log("useEffect event: ", event);
  //   }
  // }, [event]);

  // useEffect(() => {
  //   if (race) {
  //     window.localStorage.setItem("scoringRaceState", JSON.stringify(race));
  //     console.log("useEffect race: ", race);
  //   }
  //   // console.log(race);
  // }, [race]);

  return (
    <Fragment>
      {/* <ScoringMenu /> */}
      {/* <MenuDrawer /> */}
      {!event && <EventsList user={user} setEvent={setEvent}></EventsList>}
      {event && !race && (
        <RacesList event={event} setRace={setRace}></RacesList>
      )}
      {race && (
        <ScoringSetUp
          race={race}
          setRaceProperties={setRaceProperties}
          event={event}
        ></ScoringSetUp>
      )}
    </Fragment>
  );
};

export default Scoring;
