import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface checkIfSailedProps {
  race: QueryDocumentSnapshot<DocumentData>; 
  sailed?: any;
  unsailed?: any;
  cancelled?: any;
  postponed?: any;
}

/**
 *  Check against the sailing field from firestore
 * 
 *  This will return anything you supply it
 *  @param race: QueryDocumentSnapshot<DocumentData>, firestore doc
 *  @param sailed: any, will return if store is "1"
 *  @param unsailed: any, will return if store is "0"
 *  @param cancelled: any, will return if store is "cancelled"
 *  @param postponed: any, will return if store is "postponed"
 *  @returns: any
 * 
 */

export const checkIfSailed = ({ race, sailed, unsailed, cancelled, postponed }: checkIfSailedProps): any => {
  if(!race.data()) return
  if (race.data().sailed === "1") return sailed;
  if (race.data().sailed === "cancelled") return cancelled;
  if (race.data().sailed === "postponed") return postponed;
  return unsailed;
};
