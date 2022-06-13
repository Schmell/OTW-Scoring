// import { deleteDoc } from 'firebase/firestore';
// import { collection, doc, getDocs, query } from 'firebase/firestore';
import * as functions from "firebase-functions";
// import {client} from 'firebase'


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const goodByeWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});


export const removeSubCollection = functions.firestore
  .document("/series/{series}")
  .onDelete(async (snap, ctx) => {
    console.log('snap: ', snap.id);
    const cols = await snap.ref.listCollections()
    cols.forEach( async (item)=>{
      // console.log('item: ', item.listDocuments());
      const docs =  await item.listDocuments()
      docs.forEach((d)=>{
        // console.log('d: ', d);
        
        d.delete()
      })
    })

    return null



  });
