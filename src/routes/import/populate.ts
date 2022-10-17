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
  const shit = (dodo) => {
    console.log("dodo: ", dodo);
  };
  shit("smells");
  // no file so exit
  if (!file) return;

  // Make new Blw class
  const blw = new Blw({ user, file });

  // need to check the series first
  const seriesData = await blw.getSeries();



  // add owner to series data
  seriesData.__owner = user.uid;

  // add blank event
  seriesData.__event = "";

  // Get series ref
  const seriesRef = collection(db, "series");

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
        const existingFileName = seriesData.__fileInfo.name;
        const fileNameParts = existingFileName.split(".");
        seriesData.__fileInfo.name = `${fileNameParts[0]}-of-${copyDoc.id}.${fileNameParts[1]}`;
        seriesData.event = `${seriesData.event}-copy`;
        sId = await addDoc(seriesRef, seriesData);
        await addTables(sId)
      } else {
        sId = await updateDoc(doc(seriesRef, copyDoc.id), seriesData);
        await addTables(sId)
      }
    });
  } else {
    sId = await addDoc(seriesRef, seriesData);
    await addTables(sId)
  }

 async function addTables(sId){

    // i wanna make comps top level but put race specific shit on the race
    const compsData = await blw.getComps();

    // races are races
    const racesData = await blw.getRaces();
  
    //results are results
    const resultsData = await blw.getResults();
    
    // Map comps to firestore
    await compsData.forEach(async (comp: any) => {
      setDoc(doc(seriesRef, await sId.id, "comps", comp.compid), {
        _seriesid: sId.id,
        ...comp,
      });
    });
  
    // Map race to firestore
    await racesData.forEach((race: any) => {
      setDoc(doc(seriesRef, sId.id, "races", race.raceid), {
        _seriesid: sId.id,
        ...race,
      });
    });
  
    // Map results to firestore
    await resultsData.forEach((result: any) => {
      setDoc(doc(seriesRef, sId.id, "results", result.id), {
        _seriesid: sId.id,
        ...result,
      });
    });

  }

}; // populate
