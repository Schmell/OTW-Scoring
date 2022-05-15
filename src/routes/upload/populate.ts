import { User } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { route } from "preact-router";
import { getSeries, getComps, getRaces, getResults } from "../../util/blw";
import { db } from "../../util/firebase-config";

export const populate = async (user: User | null | undefined) => {
  if (!user) {
    console.warn("User not logged in ", user);
    route("/");
    return null;
  }
  const seriesData = await getSeries();
  const compsData = await getComps();
  const eventsRef = collection(db, "events");
  seriesData.__owner = user.uid;
  const sId = await addDoc(eventsRef, seriesData);

  await compsData.forEach((comp: any) => {
    setDoc(doc(eventsRef, sId.id, "comps", comp.compid), {
      _seriesid: sId.id,
      ...comp,
    });
  });

  const racesData = await getRaces();
  await racesData.forEach((race: any) => {
    // console.log("race: ", race, sId.id);
    setDoc(doc(eventsRef, sId.id, "races", race.raceid), {
      _seriesid: sId.id,
      ...race,
    });
  });

  const resultsData = await getResults();
  await resultsData.forEach((result: any, idx: any) => {
    // console.log("race: ", race, sId.id);
    setDoc(doc(eventsRef, sId.id, "results", result.id), {
      _seriesid: sId.id,
      ...result,
    });
  });
}; // populate
