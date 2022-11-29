import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    query,
    QueryDocumentSnapshot,
    SnapshotOptions,
    where,
    WithFieldValue,
  } from "firebase/firestore";
import { db } from "../util/firebase-config";
  import { Comp, IComp } from "./Comp";
import { raceConverter } from "./Race";
  import { IResult, Result } from "./Result";
  
  export interface ISeries {
    // id: string;
    // ref: DocumentReference<DocumentData>;
    raceid: string;
    [x: string | number]: any;
  }
  
  export class Series implements ISeries {
    public id: string;
    public raceid: string;
    public eventId: string;
    public ref: DocumentReference<DocumentData>;
  
    constructor(props: ISeries) {
      this.id = props.id;
      this.raceid = props.raceid;
      this.eventId = props.eventId;
      this.ref = props.ref;
      this.eventRef = this.ref.parent.parent;
      // this.race = { ...props };
      Object.assign(this, props);
    }
    // For the rest of the shit
    [x: number]: any;
    [x: string]: any;

    async getEvent?(){
        return await getDoc(doc(db, "events", this.eventId))
    }

    async getRaces?(){
        // get races from sub collection
        const racesRef = collection(this.ref, "races").withConverter(raceConverter)
        // const q = query(racesRef, where(""))
        return getDocs(racesRef)

    }

    
    async getComps?() {
      const compsQuery = query(collection(this.eventRef, "comps"));
      const comps = await getDocs(compsQuery);
      let compArray: object[] = [];
      comps.forEach((item) => {
        compArray.push(new Comp(item.data() as IComp));
      });
      return Object.assign(this, { comps: compArray });
    }
  }
  
  export const seriesConverter: FirestoreDataConverter<Series> = {
    toFirestore(race: WithFieldValue<Series>): DocumentData {
      return { raceid: race.raceid };
    },
  
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Series {
      const data = snapshot.data(options);
      return new Series({
        id: snapshot.id,
        ref: snapshot.ref,
        raceid: data.raceid,
        eventId: data.__event,
        ...data,
        snapshot
      });
    },
  };
  