import { h } from "preact";
import style from "./style.css";
import { FC, useState } from "preact/compat";
import { collection, query } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";

const Home: FC = () => {
  const eventRef = collection(db, "events");
  const [events] = useCollection(eventRef);
  const [event, setEvent] = useState<string | null>();
  console.log("event: ", event);
  const racesQuery = query(collection(db, `events/${event}/races`));
  const [races] = useCollectionData(racesQuery);
  console.log("races: ", races);
  return (
    <div class={style.home}>
      <h1>Series</h1>
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
          <li>{race.rank}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
