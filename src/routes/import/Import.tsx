import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import fileDialog from "file-dialog";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import PriBtn from "../../components/generic/PriBtn";
import { auth, db } from "../../util/firebase-config";
import { importFileObj } from "./importFileObj";
import ImportList from "./ImportList";
import { Populate } from "./populate";
// import { fileType } from "../upload/fileType";

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

  const populateWithArray = async (fileObjList) => {
    fileObjList.forEach(async (fileObj) => {
      if (fileObj.copy) {
        fileObj.file.name = "copy-" + fileObj.file.name;
      }
      if (!fileObj.copy) {
        const q = query(
          collection(db, "series"),
          where("__fileInfo.name", "==", fileObj.file.name)
        );

        const docs = await getDocs(q);
        docs.forEach((doc) => {
          console.log("doc: ", doc.data());
          deleteDoc(doc.ref);
        });
      }
      Populate(user, fileObj.file);
    });
  };

  return (
    <Box px={2}>
      <Flex justifyContent={"space-between"}>
        <Heading color="blue.400">Select File</Heading>
        <Button
          variant={"outline"}
          boxShadow="md"
          colorScheme={"blue"}
          onClick={handleChooseFile}
        >
          Choose File(s)
        </Button>
      </Flex>

      <Divider my={4} />

      <ImportList
        listItems={duplicates}
        listState={duplicates}
        setListState={setDuplicates}
        duplicates={true}
      />

      <ImportList
        listItems={newSeries}
        listState={newSeries}
        setListState={setNewSeries}
        duplicates={false}
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
            Upload
          </PriBtn>
        </Box>
      ) : (
        <Box>
          <Text as="p">
            Use the choose files button to select your Sailwave file to import
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Import;
