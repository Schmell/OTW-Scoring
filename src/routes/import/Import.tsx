import { Box, Text } from "@chakra-ui/react";
import fileDialog from "file-dialog";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../util/firebase-config";
//
import PriBtn from "../../components/generic/PriBtn";
import SecBtn from "../../components/generic/SecBtn";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";
import ImportList from "./ImportList";
import { importFileObj } from "./importTypes";
import { Populate } from "./populate";

export default function Import({ setHeaderTitle }) {
  setHeaderTitle("Import");

  const [user] = useAuthState(auth);

  const [duplicates, setDuplicates] = useState([{} as importFileObj]);
  const [newSeries, setNewSeries] = useState([{} as importFileObj]);

  const [copy, setCopy] = useState(true);

  const showDialog = async () => {
    return await fileDialog({ multiple: true, accept: ".blw" });
  };

  const checkSeries = async (fileList: FileList) => {
    const iterable = Array.from(fileList);
    const existingInfos = await getExistingFileInfos();

    let duplicateArray: importFileObj[] = [];

    iterable.forEach((file) => {
      existingInfos.forEach((info) => {
        if (file.name === info.name) {
          duplicateArray.push({
            seriesId: info.seriesId,
            name: file.name,
            duplicate: true,
            file: file,
            copy: copy,
          });
        }
      });
    });

    let newFileArray: importFileObj[] = [];

    iterable.forEach((file) => {
      if (
        !duplicateArray.find((dup) => {
          if (dup.name === file.name) return true;
        })
      ) {
        newFileArray.push({
          name: file.name,
          file: file,
          duplicate: false,
          copy: false,
        });
      }
    });

    return [...newFileArray, ...duplicateArray];
  };

  const getExistingFileInfos = async () => {
    // Set up firstore query
    const sersRef = collection(db, "series");
    const sersQuery = query(sersRef, where("__owner", "==", user?.uid));
    const sersDocs = await getDocs(sersQuery);

    // return array of fileInfos wit series id added in
    return sersDocs.docs.map((ser, index, array) => {
      const fileInfo = ser.data().__fileInfo;
      const seriesId = ser.id;
      return (array[index] = { seriesId, ...fileInfo });
    });
  };

  const handleChooseFile = async () => {
    const fileList = await showDialog();
    const checked = await checkSeries(fileList);

    let dups: importFileObj[] = [];
    let ups: importFileObj[] = [];

    checked.forEach((item) => {
      if (item.duplicate) {
        dups.push(item);
      } else {
        ups.push(item);
      }
    });
    setDuplicates(dups);
    setNewSeries(ups);
  };

  const populateWithArray = (fileObjList: importFileObj[]) => {
    fileObjList.forEach(async (fileObj) => {
      const { file } = fileObj;
      if (!copy) {
        const colRef = collection(db, "series");
        const q = query(colRef, where("__fileInfo.name", "==", file.name));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      }
      Populate({ user, file, copy });
    });
  };

  useEffect(() => {
    handleChooseFile();
  }, []);

  return (
    <Page>
      <PageHead title="Select File">
        <SecBtn onClick={handleChooseFile}>Choose File(s)</SecBtn>
      </PageHead>

      <ImportList
        listItems={duplicates}
        listState={duplicates}
        setListState={setDuplicates}
        duplicates={true}
        setCopy={setCopy}
      />

      <ImportList
        listItems={newSeries}
        listState={newSeries}
        setListState={setNewSeries}
        duplicates={false}
        setCopy={setCopy}
      />

      {newSeries.find((ups) => {
        if (ups.name) return true;
      }) ||
      duplicates.find((dup) => {
        if (dup.name) return true;
      }) ? (
        <Box px={1}>
          <PriBtn
            width={"100%"}
            onClick={() => {
              populateWithArray([...duplicates, ...newSeries]);
              route("/series");
            }}
          >
            Import
          </PriBtn>
        </Box>
      ) : (
        <Text as="p" m={4}>
          Use the choose files button to select your Sailwave file(s) to import
        </Text>
      )}
    </Page>
  );
}
