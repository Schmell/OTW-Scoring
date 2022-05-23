import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "preact/hooks";
import { auth, db } from "../util/firebase-config";

/**
 * Similar to `useState` but with some lightweight behind-the-scenes
 * writing to firestore 
 *
 * @param {string} key The string key name to be written to firebase
 
 * @param {string} initialvalue 
 * @returns 
 */


const useFireState = (key: string, initialvalue?: string): any[] =>{
    const [user] = useAuthState(auth)
    const docRef = doc(db, "users", user!.uid)
    

    const getUserData = async ()=>{
        return await getDoc(docRef);
    }
    //
    const [value, setValue] = useState(async ()=>{
        const doc = await getUserData()
        const docData = doc.data()
        console.log('docData: ', docData);
        if(docData) return docData[key]
        if(initialvalue) return initialvalue
        return value


    });
    

    useEffect(()=>{
        const update = async ()=>{
            // get userData from firestore
            const userData = await getUserData()
            if(!userData.data()){
                await setDoc(docRef, {id: user!.uid, [key]: initialvalue});
            }
            console.log('value: ', value);
            await updateDoc(docRef, {[key]: await value});
        }
        update();

    },[key, value])

    return [value, setValue];
}


export default useFireState;