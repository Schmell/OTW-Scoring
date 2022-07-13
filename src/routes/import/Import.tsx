import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../util/firebase-config";
import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import fileDialog from "file-dialog";
//
import PriBtn from "../../components/generic/PriBtn";
import ImportList from "./ImportList";
import { importFileObj } from "./importTypes";
import { Populate } from "./populate";

const Import = ({ setHeaderTitle }) => {
  setHeaderTitle("Import");

  const [user] = useAuthState(auth);

  const [duplicates, setDuplicates] = useState([{} as importFileObj]);
  const [newSeries, setNewSeries] = useState([{} as importFileObj]);

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
            copy: true,
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
      //   console.log("item: ", item);
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
      const { copy, file } = fileObj;

      if (!copy) {
        const colRef = collection(db, "series");
        const q = query(colRef, where("__fileInfo.name", "==", file.name));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      }

      Populate(user, file);
    });
  };

  return (
    <Box px={2}>
      <Flex justifyContent={"space-between"}>
        <Heading color="blue.400">Select File</Heading>
        <Button variant={"outline"} boxShadow="md" colorScheme={"blue"} onClick={handleChooseFile}>
          Choose File(s)
        </Button>
      </Flex>

      <Divider my={4} />

      <ImportList listItems={duplicates} listState={duplicates} setListState={setDuplicates} duplicates={true} />

      <ImportList listItems={newSeries} listState={newSeries} setListState={setNewSeries} duplicates={false} />

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
        <Box>
          <Text as="p">Use the choose files button to select your Sailwave file to import</Text>
        </Box>
      )}
    </Box>
  );
};

export default Import;
