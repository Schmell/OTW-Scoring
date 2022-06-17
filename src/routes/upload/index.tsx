import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import fileDialog from "file-dialog";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Field, Form, Formik } from "formik";
import { h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../util/firebase-config";
import { Populate } from "./populate";
import style from "./style.css";

const Upload = ({ setHeaderTitle }) => {
  setHeaderTitle("Upload");
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState(File[""]);
  const [importedFile, setImportedFile] = useState();

  // let importedFile: any;

  const showDialog = async () => {
    return await fileDialog({ multiple: true, accept: ".blw" });
  };

  const populateWithAll = (fileObj: FileList) => {
    const iterable = Array.from(fileObj);
    setFiles(iterable);
    iterable.forEach((item) => {
      Populate(user, item);
    });
    route("/series");
  };

  const getExistingFileInfos = async () => {
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
    return iterable.map(async (file) => {
      return await compareSeriesWithDb(file);
    });
  };

  //
  const compareSeriesWithDb = async (file: File) => {
    // Get existing series's (fileInfo's only) that belong to user
    const existingInfos = await getExistingFileInfos();
    // Now compare against the incoming fileList
    return existingInfos.filter((info, index, array) => {
      if (info.fileName === file.name) {
        return info;
      }
    });
  };

  const handleUpload = async () => {
    // console.log("target.files[0]: ", importedFile);
    Populate(user, importedFile);

    // Upload file to storage
    // I thin this could be just an option
    // const blwRef = ref(storage, `${user?.uid}/${importedFile.name}`);
    // const snap = await uploadBytes(blwRef, importedFile);

    route("/series");
  };

  return (
    <Box className={style.upload}>
      <Heading color="blue.400" mb={3}>
        Select File
      </Heading>
      {/* <Formik
        initialValues={{
          file: "",
        }}
        onSubmit={handleUpload}
      >
        <Form>
          <Box>
            <FormLabel htmlFor="file">Upload</FormLabel>
            <Field
              type="file"
              id="file"
              name="file"
              className={style.fileInput}
              onChange={({ target }) => {
                setImportedFile(target.files[0]);
              }}
            />
          </Box>
          <Box mt={3}>
            <Button
              type="submit"
              variant="outline"
              colorScheme="blue"
              boxShadow="md"
            >
              Submit
            </Button>
          </Box>
        </Form>
      </Formik> */}

      <Divider my={4} />

      <Flex gap={4} p={2}>
        <Button
          variant={"outline"}
          boxShadow="lg"
          colorScheme={"blue"}
          onClick={async () => {
            const fileList = await showDialog();
            const duplicates = await checkSeries(fileList);
            console.log("duplicates: ");
          }}
        >
          Choose Files
        </Button>

        <List>
          {files &&
            files.map((file) => (
              <ListItem>
                <Text color={"blue.500"}>{file.name}</Text>
              </ListItem>
            ))}
        </List>
      </Flex>
    </Box>
  );
};

export default Upload;
