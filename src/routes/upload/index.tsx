import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import fileDialog from "file-dialog";
import { collection, getDocs, query, where } from "firebase/firestore";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Fragment } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PriBtn from "../../components/generic/PriBtn";
import useArray from "../../hooks/useArray";
import { auth, db } from "../../util/firebase-config";
import { fileType } from "./fileType";
import { Populate } from "./populate";
import style from "./style.css";
import UploadList from "./UploadList";

const Upload = ({ setHeaderTitle }) => {
  setHeaderTitle("Upload");
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState(File[""]);
  const [importedFile, setImportedFile] = useState();

  const [duplicates, setDuplicates] = useState([{} as fileType]);
  const [uploading, setUploading] = useState([{} as fileType]);
  const dupArray = useArray([]);

  // let importedFile: any;

  // I think i need to redo this
  // maybe make the duplicates object in this shape
  type duplicatesObj = {
    seriesId: string;
    name: string;
    file: File;
    duplicate: boolean;
  };

  const showDialog = async () => {
    return await fileDialog({ multiple: true, accept: ".blw" });
  };

  const populateWithAll = (fileList: FileList) => {
    const iterable = Array.from(fileList);
    setFiles(iterable);
    iterable.forEach((item) => {
      Populate(user, item);
    });
    // route("/series");
  };
  const populateWithArray = (fileList) => {
    // const iterable = Array.from(fileList);
    // console.log("fileList: ", fileList);
    // setFiles(iterable);
    fileList.forEach((item: File) => {
      console.log("item: ", item);
      Populate(user, item);
    });
    // route("/series");
  };

  const getExistingFileInfos = async (): Promise<fileType[]> => {
    // Set up firstore query
    const sersRef = collection(db, "series");
    const sersQuery = query(sersRef, where("__owner", "==", user?.uid));
    const sersDocs = await getDocs(sersQuery);

    // return array of fileInfos wit series id added in
    return sersDocs.docs.map((ser, index, array) => {
      const fileInfo = ser.data().__fileInfo;
      const serId = ser.id;
      return (array[index] = { serId, ...fileInfo });
    });
  };

  const checkSeries = async (fileList: FileList) => {
    const iterable = Array.from(fileList);

    const dupsMap = iterable.map(async (file) => {
      return await compareSeriesWithDb(file);
    });

    const mappedArrays = Promise.all(dupsMap);
    return await mappedArrays;
  };

  //
  const compareSeriesWithDb = async (file): Promise<fileType> => {
    // Get existing series's (fileInfo's only) that belong to user
    const existingInfos = await getExistingFileInfos();
    // console.log("file: ", await file.text());
    // Now compare against the incoming fileList
    const matched = existingInfos.filter((info) => {
      if (info.fileName === file.name) {
        file.duplicate = true;
        return file;
      }
    });
    // if its a mact return it
    if (matched[0]) {
      matched[0].duplicate = true;
      return matched[0];
    } else {
      // need to add file name
      // TODO just call it name on import
      // file.fileName = file.name;

      return file;
    }
  };

  const handleChooseFile = async () => {
    const fileList = await showDialog();
    const checked = await checkSeries(fileList);
    // console.log("checked: ", checked);
    let dups: fileType[] = [];
    let ups: fileType[] = [];
    checked.forEach((item) => {
      if (item.duplicate) {
        // console.log("checked duplicates: ", duplicates);
        // console.log("item: ", item.text());
        dups.push(item);
        // return;
      } else {
        ups.push(item);
        // return;
      }
    });
    // console.log("dups: ", dups);
    // console.log("ups: ", ups);
    setDuplicates(dups);
    setUploading(ups);
    // populateWithAll(fileList);
  };

  useEffect(() => {
    // console.log("duplicates: ", duplicates);
  }, [duplicates]);

  return (
    <Box className={style.upload}>
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

      <UploadList
        listItems={duplicates}
        listState={duplicates}
        setListState={setDuplicates}
        duplicates={true}
      />

      <UploadList
        listItems={uploading}
        listState={uploading}
        setListState={setUploading}
        duplicates={false}
      />

      {uploading.find((ups) => {
        if (ups.fileName) return true;
      }) ||
      duplicates.find((dup) => {
        if (dup.fileName) return true;
      }) ? (
        <Box px={1}>
          <PriBtn
            width={"100%"}
            onClick={() => {
              const cleanDups = duplicates.filter((dup) => {
                if (dup.fileName) return dup;
              });
              cleanDups.forEach((item) => {
                console.log("item: ", item);
              });
              populateWithArray(cleanDups);
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

export default Upload;
