// import { collection, setDoc, doc, addDoc } from "firebase/firestore";
import style from "./style.css";
// import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../util/firebase-config";
import {
  fromInput,
  getComps,
  getRaces,
  getResults,
  getSeries,
} from "../../util/blw";
import { Fragment, h } from "preact";
import { FC } from "preact/compat";
import { populate } from "./populate";

interface UploadProps {
  name?: string;
}

const Upload: FC<UploadProps> = ({ name }) => {
  const [user] = useAuthState(auth);
  const getFile = async (e: any) => {
    fromInput(e);
    // populate();
  };

  return (
    <div class={style.upload}>
      <form class={style.uploadForm}>
        <label>Upload BLW File</label>
        <input class={style.input} type="file" onChange={(e) => getFile(e)} />
      </form>
      <button class={style.btn} onClick={() => populate(user)}>
        Send Data
      </button>
    </div>
  );
};

export default Upload;
