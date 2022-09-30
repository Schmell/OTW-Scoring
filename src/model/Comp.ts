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
import { IResult, Result } from "./Result";

export interface IComp {
  id: string;
  ref: DocumentReference<DocumentData>;
  compid: string;
  raceid?: string;
  comps?: {};
  results?: {};
  [x: string | number]: any;
}

export class Comp implements IComp {
  readonly id: string;
  public ref: DocumentReference<DocumentData>;
  public compid: string;
  [x: number]: any;
  [x: string]: any;

  constructor(props: IComp) {
    this.id = props.id;
    this.ref = props.ref;
    this.compid = props.compid;
    this.eventRef = this.ref?.parent?.parent;
    // as its own object
    this.comp = { ...props };
    // as root propeties
    // Object.assign(this, props);
  }

  async mergeResults?() {
    const resultsQuery = query(
      collection(this.eventRef, "results"),
      where("compid", "==", this.compid)
    );
    const results = await getDocs(resultsQuery);
    let resultArray: Comp[] = [];
    results.forEach((item) => {
      item.data().eventRef = item.ref.parent.parent;
      resultArray.push(new Result(item.data() as IResult));
    });
    // return "merged";
    return Object.assign(this, { results: resultArray });
  }

  async mergeResult?(raceid) {
    const resultsQuery = query(
      collection(this.eventRef, "results"),
      where("compid", "==", this.compid),
      where("raceid", "==", raceid)
    );
    const results = await getDocs(resultsQuery);
    let resultArray: Comp[] = [];
    results.forEach((item) => {
      item.data().eventRef = item.ref.parent.parent;
      resultArray.push(new Result(item.data() as IResult));
    });
    // return "merged";
    return Object.assign(this, { results: resultArray });
  }

  async mergeRace?() {
    // eventRef is not always constructed ??
    // How to set this check on the class automatically ??
    // console.log("mergeRace  ", arguments);
    if (!this.eventRef) {
      this.eventRef = this.ref?.parent?.parent;
    }
    // get the race for this result
    const racesQuery = query(
      collection(this.eventRef, "races"),
      where("raceid", "==", this.raceid)
    );
    const races = await getDocs(racesQuery);

    // add Race to result object
    return Object.assign(this, { race: races.docs[0].data() });
  }
}

export const compConverter: FirestoreDataConverter<Comp> = {
  // not too sure if this works for writting to db yet
  // probably need to add more propeties etc..
  toFirestore(comp: WithFieldValue<Comp>): DocumentData {
    return { compid: comp.compid };
  },

  // This will turn our result from firestore to a Comp class
  //
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Comp {
    const data = snapshot.data(options);
    return new Comp({
      id: snapshot.id,
      ref: snapshot.ref,
      compid: data.compid,
      ...data,
    });
  },
};
