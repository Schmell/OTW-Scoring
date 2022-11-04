import { addDoc, collection } from "firebase/firestore";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

export async function addOrganization(uid){
  // const {uid} = props
    // const [org, setOrgId] = useStorage("orgId")

    const colRef = collection(db, "organizations")
    const docRef = await addDoc(colRef, {
        orgName: "New Name",
        __owner: uid,
      });

      // setOrgId(docRef.id);
      route(`/organization/edit/${docRef.id && docRef.id}`);
}