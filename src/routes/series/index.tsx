import { h } from "preact";
import style from "./style.css";
import { FC, useState } from "preact/compat";
import { collection, query, where } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import { Link } from "preact-router";

const Series: FC = () => {
  const eventRef = collection(db, "events");
  const [events] = useCollection(eventRef);
  const [event, setEvent] = useState<string | null>();
  const [race, setRace] = useState<string>("1");

  // next step is not to get comps rather display race results
  // or start un-sailed race with the comps
  const [results, setResults] = useState<string | null>();
  console.log("results: ", results);

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
  return (
    <div class={style.series}>
      <h1>Series</h1>
      <Link activeClassName={style.active} href="/upload">
        Upload
      </Link>
      <ul>
        {events &&
          events.docs.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={() => {
                  setEvent(item.id);
                }}
              >
                {item.data().event}
              </a>
            </li>
          ))}
      </ul>
      <ul>
        {races?.map((race) => (
          <li>
            <span class={race.sailed === "1" ? style.sailed : style.unsailed}>
              <a
                href="#"
                class={style.raceSpan}
                onClick={() => setRace(race.raceid)}
              >
                {race.rank} {race.name ? " - " + race.name : null}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Series;
