import {
    collection, doc, DocumentData,
    DocumentReference,
    FirestoreDataConverter, getDoc, getDocs,
    query,
    QueryDocumentSnapshot,
    SnapshotOptions,
    where,
    WithFieldValue
} from "firebase/firestore";
import { db } from "../util/firebase-config";
import { seriesConverter } from "./Series";
 
  export class Event {
    public id: string;
    public ref: DocumentReference<DocumentData>;
    public __owner: string;
    public name: string;
    public organization: string;
    public venue: string;
  
    constructor(props) {
      this.id = props.id;
      this.ref = props.ref;
      this.__owner = props.__owner
      this.name = props.name
      this.organization = props.organization
      this.venue = props.venue
      
      // this.race = { ...props };
      Object.assign(this, props);
    }
    // For the rest of the shit
    [x: number]: any;
    [x: string]: any;

    async getSeries?(){
        // get series that belong to the event
        const seriesRef = collection(db, "series").withConverter(seriesConverter)
        const eventSeries = query(seriesRef, where("__event", "==", this.id))
        return await getDocs(eventSeries)

    }

    async getOwner(){
        return getDoc(doc(db, "user", this.__owner))
    }

    async getOrganization(){
        return getDoc(doc(db, "organizations", this.__organization))
    }

    async getVenue(){
        return getDoc(doc(db, "venues", this.venue))
    }
    
    async getFollowers?() {
        const followRef = collection(db, "followEvents")
        const followQuery = query(followRef, where("followId", "==", this.id))
        const followingDocs =  await getDocs(followQuery)
        const followers = followingDocs.docs.map(async (follower)=>{
           return getDoc(doc(db, "user", follower.data().userId ))
        })
        return followers
    }

  } // Event class
  
  export const eventConverter: FirestoreDataConverter<Event> = {
    toFirestore(race: WithFieldValue<Event>): DocumentData {
      return { raceid: race.raceid };
    },
  
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Event {
      const data = snapshot.data(options);
      return new Event({
        id: snapshot.id,
        ref: snapshot.ref,
        name: data.name,
        organization: data.organization,
        venue: data.venue,
        ...data,
        snapshot
      });
    },
  };
  