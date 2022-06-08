import {
  collection,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDocs,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
  WithFieldValue,
} from "firebase/firestore";

// import { eRef } from "../util/firebase-config";

// import { eventRef } from "./App";

export interface IResult {
  id: string;
  ref: DocumentReference<DocumentData>;
  raceid: string;
  compid: string;
  [x: string | number]: any;
}

export class Result implements IResult {
  public id: string;
  public ref: DocumentReference<DocumentData>;
  public raceid: string;
  public compid: string;
  public result?: object;
  [x: number]: any;
  [x: string]: any;

  constructor(props: IResult) {
    this.id = props.id;
    this.ref = props.ref;
    this.compid = props.compid;
    this.raceid = props.raceid;
    this.eventRef = this.ref?.parent?.parent;
    // as its own object
    // this.result = { ...props };
    // as root propeties
    Object.assign(this, props);
  }

  async mergeComp?() {
    // eventRef is not always constructed ??
    // How to set this check on the class automatically ??
    // console.log("result mergeComp");
    if (!this.eventRef) {
      this.eventRef = this.ref?.parent?.parent;
    }
    // get the comp for this result
    const compsQuery = query(
      // ///////////////////////////////////////////////////////////////////////////////
      // I CHANGED THIS FROM eRef wich was a hard coded value for testing
      // ///////////////////////////////////////////////////////////////////////////////
      collection(this.ref, "comps"),
      where("compid", "==", this.compid)
    );
    const comps = await getDocs(compsQuery);

    // add comp to Result object
    return Object.assign(this, { comp: comps.docs[0].data() });
  }

  async mergeRace?() {
    // eventRef is not always constructed ??
    // How to set this check on the class automatically ??
    if (!this.eventRef) {
      this.eventRef = this.ref?.parent?.parent;
    }

    const racesQuery = query(
      // ///////////////////////////////////////////////////////////////////////////////
      // I CHANGED THIS FROM eRef wich was a hard coded value for testing
      // ///////////////////////////////////////////////////////////////////////////////
      collection(this.ref, "races"),
      where("raceid", "==", this.raceid)
    );
    const races = await getDocs(racesQuery);

    // add Race to result object
    return Object.assign(this, { race: races.docs[0].data() });
  }
}

export const resultConverter: FirestoreDataConverter<Result> = {
  // not too sure if this works for writting to db yet
  // probably need to add more propeties etc..
  toFirestore(result: WithFieldValue<Result>): DocumentData {
    return { compid: result.compid, raceid: result.raceid };
  },

  // This will turn our result from firestore to a Result class
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Result {
    const data = snapshot.data(options);
    return new Result({
      id: snapshot.id,
      ref: snapshot.ref,
      compid: data.compid,
      raceid: data.raceid,
      ...data,
    });
  },
};
