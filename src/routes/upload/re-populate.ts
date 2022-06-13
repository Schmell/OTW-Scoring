import { User } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { route } from "preact-router";
import { getSeries, getComps, getRaces, getResults } from "../../util/blw";
import { Blw } from "../../util/Blw_class";
import { db } from "../../util/firebase-config";

export const rePopulate = async (user: User | null | undefined, file) => {
  if (!user) {
    console.warn("User not logged in ", user);
    route("/");
    return null;
  }
  // i dont want to rely on localStorage any more
  // i re-wrote blw as a class to access methods
  const blw = new Blw({ user, file });
  const seriesData = await blw.getSeries();
  const compsData = await blw.getComps();
  const racesData = await blw.getRaces();

  // Need to stop using events to represent series
  // Will have a top level events to encapsulate multi-series events 
  const seriesRef = collection(db, "series");
  seriesData.__owner = user.uid;
  const sId = await addDoc(seriesRef, seriesData);

  await compsData.forEach((comp: any) => {
    setDoc(doc(seriesRef, sId.id, "comps", comp.compid), {
      _seriesid: sId.id,
      ...comp,
    });
  });

  await racesData.forEach((race: any) => {
    // console.log("race: ", race, sId.id);
    setDoc(doc(seriesRef, sId.id, "races", race.raceid), {
      _seriesid: sId.id,
      ...race,
    });
  });

  const resultsData = await getResults();
  await resultsData.forEach((result: any, idx: any) => {
    // console.log("race: ", race, sId.id);
    setDoc(doc(seriesRef, sId.id, "results", result.id), {
      _seriesid: sId.id,
      ...result,
    });
  });
}; // populate
