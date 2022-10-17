import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { route } from "preact-router";
import Blw from "../../util/Blw";
import { db } from "../../util/firebase-config";

interface PopulateProps {
  user: User | null | undefined;
  file: File;
  copy?: boolean;
}

export const Populate = async ({ user, file, copy }: PopulateProps) => {
  if (!user) {
    console.warn("User not logged in ", user);
    route("/");
    return null;
  }

  // no file so exit
  if (!file) return;

  // Make new Blw class
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
  /////////////////////////////////////////////////////////////////////
  // So this whole process needs to proceed as as series of functions
  // first we look for duplicates
  // if - then copy or overwrite
  // then get comps / races / results

  // const findCopyFile = query(seriesRef, where(__fileInfo))
  let sId;

  const findCopyFile = query(
    collectionGroup(db, "series"),
    where("__fileInfo.name", "==", seriesData.__fileInfo.name)
  );
  const copies = await getDocs(findCopyFile);
  // No copies so write as is
  if (!copies.empty) {
    copies.forEach(async (copyDoc) => {
      if (copy) {
        console.log("copy: ", copy);
        const existingFileName = seriesData.__fileInfo.name;
        const fileNameParts = existingFileName.split(".");
        seriesData.__fileInfo.name = `${fileNameParts[0]}-of-${copyDoc.id}.${fileNameParts[1]}`;
        seriesData.event = `${seriesData.event}-${copyDoc.id}`;
        sId = await addDoc(seriesRef, seriesData);
        console.log("sId: ", sId.id);
      } else {
        // const docRef = doc(seriesRef, copyDoc.id);
        sId = await updateDoc(doc(seriesRef, copyDoc.id), seriesData);
      }
    });
  } else {
    console.log("copies.empty: ", copies.empty);
    sId = await addDoc(seriesRef, seriesData);
  }

  // Map comps to firestore
  await compsData.forEach(async (comp: any) => {
    // console.log("comp: ", comp, sId.id);
    console.log("sId.id: ", await sId.id);
    setDoc(doc(seriesRef, await sId.id, "comps", comp.compid), {
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
