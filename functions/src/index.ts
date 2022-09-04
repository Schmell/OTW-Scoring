import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const removeSubCollection = functions.firestore
  .document("/series/{series}")
  .onDelete(async (snap) => {
    console.log('deleting SubCollections of: ', snap.id);

    // get current sub collections
    const cols = await snap.ref.listCollections()
    
    // each collection 
    cols.forEach( async (item)=>{
      const docs =  await item.listDocuments()

      // get docs and delete them
      docs.forEach((d)=>{
        d.delete()
      })
    })

    // This is probably not right
    // should resolve i think, but maybe it doesnt matter
    // also no error handling currently
    return null

  });
