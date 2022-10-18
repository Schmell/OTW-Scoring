import { h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../util/firebase-config";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import fileDialog from "file-dialog";
//
import PriBtn from "../../components/generic/PriBtn";
import ImportList from "./ImportList";
import { importFileObj } from "./importTypes";
import { Populate } from "./populate";
import SecBtn from "../../components/generic/SecBtn";
import BtnGrp from "../../components/generic/ButtonGroup";
import { Form, Formik } from "formik";
import { Page } from "../../components/page/Page";

export default function Import({ setHeaderTitle }) {
  setHeaderTitle("Import");

  const [user] = useAuthState(auth);

  const [duplicates, setDuplicates] = useState([{} as importFileObj]);
  const [newSeries, setNewSeries] = useState([{} as importFileObj]);

  const [selectedButton, setSelectedButton] = useState("");

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
      <Box px={2} mt="60px">
        <Flex justifyContent={"space-between"}>
          <Heading color="blue.400">Select File</Heading>
          <SecBtn onClick={handleChooseFile}>Choose File(s)</SecBtn>
        </Flex>

        <Divider my={4} />

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
          <Box>
            {/* <Formik
              onSubmit={(vals) => {
                console.log("values: ", vals);
              }}
              initialValues={{
                labels: selectedButton,
                resultType: selectedButton,
              }}
            >
              {({
                values: { labels },
                setFieldValue,
                handleChange,
                submitForm,
              }) => {
                return (
                  <Form>
                    <BtnGrp
                      labels={["points", "elapsed", "corrected", "finishes"]}
                      mb={2}
                      size="sm"
                      onChange={handleChange}
                      setSelectedButton={setSelectedButton}
                      selectedButton={selectedButton}
                      // name="resultType"
                    />
                    <Divider m={4} />

                    <ButtonGroup isAttached>
                      <Button
                        name="resultType"
                        onClick={(e) => {
                          console.log("e: ", e.target);
                          setSelectedButton("one");
                        }}
                        borderRight={"none"}
                        isActive={selectedButton === "one" ? true : false}
                        _active={{
                          boxShadow: "none",
                          background: "blue.100",
                          color: "blue.600",
                        }}
                      >
                        one
                      </Button>
                      <Button
                        name="resultType"
                        onClick={(e) => {
                          console.log("e: ", e.target);
                          setSelectedButton("two");
                        }}
                        borderRight={"none"}
                        isActive={selectedButton === "two" ? true : false}
                        _active={{
                          boxShadow: "none",
                          background: "blue.100",
                          color: "blue.600",
                        }}
                      >
                        two
                      </Button>
                      <Button
                        name="resultType"
                        onClick={(e) => {
                          console.log("e: ", e.target);
                          setSelectedButton("three");
                        }}
                        // borderRight={"none"}
                        isActive={selectedButton === "three" ? true : false}
                        _active={{
                          boxShadow: "none",
                          background: "blue.100",
                          color: "blue.600",
                        }}
                      >
                        three
                      </Button>
                    </ButtonGroup>
                    <Divider m={4} />
                    <Button type="submit"> go </Button>
                  </Form>
                );
              }}
            </Formik> */}
            <Text as="p">
              Use the choose files button to select your Sailwave file(s) to
              import
            </Text>
          </Box>
        )}
      </Box>
    </Page>
  );
}
