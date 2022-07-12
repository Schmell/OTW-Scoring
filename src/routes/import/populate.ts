import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { route } from "preact-router";
import  Blw  from "../../util/Blw";
import { db } from "../../util/firebase-config";

export const Populate = async (user: User | null | undefined, file: File) => {
  if (!user) {
    console.warn("User not logged in ", user);
    route("/");
    return null;
  }

  if (!file) return;
  const blw = new Blw({ user, file });

  // need to check the series first
  const seriesData = await blw.getSeries();

  // i wanna make comps top level but put race specific shit on the race
  const compsData = await blw.getComps();

  // races are races
  const racesData = await blw.getRaces();

  //results are results
  const resultsData = await blw.getResults();

  // add owner to series data
  seriesData.__owner = user.uid;

  // add blank event
  seriesData.__event = "";

  // Get series ref
  const seriesRef = collection(db, "series");

  // add series doc
  const sId = await addDoc(seriesRef, seriesData);

  // Map comps to firestore
  await compsData.forEach((comp: any) => {
    // console.log("comp: ", comp, sId.id);
    setDoc(doc(seriesRef, sId.id, "comps", comp.compid), {
      _seriesid: sId.id,
      ...comp,
    });
  });

  // Map race to firestore
  await racesData.forEach((race: any) => {
    // console.log("race: ", race, sId.id);
    setDoc(doc(seriesRef, sId.id, "races", race.raceid), {
      _seriesid: sId.id,
      ...race,
    });
  });

  // Map results to firestore
  await resultsData.forEach((result: any) => {
    // console.log("result: ", result, sId.id);
    setDoc(doc(seriesRef, sId.id, "results", result.id), {
      _seriesid: sId.id,
      ...result,
    });
  });
}; // populate
