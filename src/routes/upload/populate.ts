import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getSeries, getComps, getRaces, getResults } from "../../util/blw";
import { auth, db } from "../../util/firebase-config";

export const populate = async (user: any) => {
  if (!user) {
    console.log("user: not logged in ", user);
    return null;
  }
  const seriesData = await getSeries();
  const compsData = await getComps();
  // console.log("seriesData: ", seriesData);
  const eventsRef = collection(db, "events");
  seriesData.__owner = user.uid;
  const sId = await addDoc(eventsRef, seriesData);
  console.log("sId: ", sId.id);

  await compsData.forEach((comp: any) => {
    setDoc(doc(eventsRef, sId.id, "comps", comp.compid), {
      _seriesid: sId.id,
      ...comp,
    });
  });

  const racesData = await getRaces();
  await racesData.forEach((race: any) => {
    //   console.log("race: ", race, sId.id);
    setDoc(doc(eventsRef, sId.id, "races", race.raceid), {
      _seriesid: sId.id,
      ...race,
    });
  });

  const resultsData = await getResults();
  await resultsData.forEach((result: any, idx: any) => {
    //   console.log("race: ", race, sId.id);
    setDoc(doc(eventsRef, sId.id, "results", result.id), {
      _seriesid: sId.id,
      ...result,
    });
  });

  // console.log("sId: ", sId);
  // await setDoc(doc(eventsRef))
}; // populate
