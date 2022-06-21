import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { route } from "preact-router";
import { Blw } from "../../util/Blw";
import { db } from "../../util/firebase-config";

export const Populate = async (
  user: User | null | undefined,
  file: File | undefined
) => {
  if (!user) {
    console.warn("User not logged in ", user);
    route("/");
    return null;
  }
  // i dont want to rely on localStorage any more
  // i re-wrote blw as a class to access methods
  if (!file) return;
  const blw = new Blw({ user, file });
  // now i need to check wether these files are copies or not
  // i guess i need to modify a lastmodified date on server stuff

  // need to check the series first
  const seriesData = await blw.getSeries();

  // i wanna make comps top level but put race specific shit on the race
  const compsData = await blw.getComps();

  // races are races
  const racesData = await blw.getRaces();

  //results are results
  const resultsData = await blw.getResults();

  // Will have a top level events to encapsulate multi-series events

  // add owner to series data
  seriesData.__owner = user.uid;

  // Get series ref
  const seriesRef = collection(db, "series");

  // need to check wether this file exists and modified dates are differnet first
  // not sure how this will work
  // I guess this should return the messages
  // and then the user can decide what to do
  // So turn the the set doc statements into exported functions
  // checkSeries(seriesRef, file);

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

const checkSeries = async (
  seriesRef: CollectionReference<DocumentData>,
  file: File
) => {
  //
  const ser = await getDocs(seriesRef);

  ser.docs.forEach((s) => {
    if (file.name === s.data().__fileInfo.fileName) {
      console.log("File name already exists in database");
    }

    if (file.lastModified > s.data().__fileInfo.lastModified) {
      console.log("Fle waas modified since it waas uploaded");
      console.log("Fle was modified:", s.data().__fileInfo.lastModifiedDate);
    }
  });

  // throw new Error("Function not implemented.");
};
