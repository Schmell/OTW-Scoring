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
import { Comp, IComp } from "./Comp";
import { IResult, Result } from "./Result";

export interface IRace {
  // id: string;
  // ref: DocumentReference<DocumentData>;
  raceid: string;
  [x: string | number]: any;
}

export class Race implements IRace {
  public id: string;
  public raceid: string;
  public ref: DocumentReference<DocumentData>;

  constructor(props: IRace) {
    this.id = props.id;
    this.raceid = props.raceid;
    this.ref = props.ref;
    this.eventRef = this.ref.parent.parent;
    // this.race = { ...props };
    Object.assign(this, props);
  }
  // For the rest of the shit
  [x: number]: any;
  [x: string]: any;

  async mergeResults?() {
    const resultsQuery = query(
      collection(this.eventRef, "results"),
      where("raceid", "==", this.raceid)
    );
    const results = await getDocs(resultsQuery);
    let resultArray: Result[] = [];
    results.forEach((item) => {
      item.data().eventRef = item.ref.parent.parent;
      resultArray.push(new Result(item.data() as IResult));
    });
    // return "merged";
    return Object.assign(this, { results: resultArray });
  }

  async mergeComps?() {
    const compsQuery = query(collection(this.eventRef, "comps"));
    const comps = await getDocs(compsQuery);
    let compArray: object[] = [];
    comps.forEach((item) => {
      compArray.push(new Comp(item.data() as IComp));
    });
    // console.log("this: ", this);
    // return "merged";
    return Object.assign(this, { comps: compArray });
  }
}

export const raceConverter: FirestoreDataConverter<Race> = {
  toFirestore(race: WithFieldValue<Race>): DocumentData {
    return { raceid: race.raceid };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Race {
    const data = snapshot.data(options);
    return new Race({
      id: snapshot.id,
      ref: snapshot.ref,
      raceid: data.raceid,
      ...data,
    });
  },
};
