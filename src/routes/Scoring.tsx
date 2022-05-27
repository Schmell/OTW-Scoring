import { Fragment, FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../util/firebase-config";
import { EventsList } from "./scoring/EventsList";
import { RacesList } from "./scoring/RacesList";
import { RaceProperties } from "./scoring/RaceProperties";

const Scoring = (props) => {
  // This should be the entry point to the scoring app
  // Maybe we can figure out scoring system from series data (ie: postion, finish, etc..)
  // This pagge should probably heve a way to select the race you wanna score
  //
  const [user] = useAuthState(auth);
  const [event, setEvent] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [raceProperties, setRaceProperties] = useState<string | null>();

  /*
   * Need to make the state persistent
   */

  return (
    <Fragment>
      <EventsList {...props}></EventsList>
    </Fragment>
  );
};

export default Scoring;
