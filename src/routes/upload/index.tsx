import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import fileDialog from "file-dialog";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Field, Form, Formik } from "formik";
import { h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Fragment } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdClear, MdControlPointDuplicate } from "react-icons/md";
import useArray from "../../hooks/useArray";
import { auth, db, storage } from "../../util/firebase-config";
import { Populate } from "./populate";
import style from "./style.css";

const Upload = ({ setHeaderTitle }) => {
  setHeaderTitle("Upload");
  // user Auth should come from firbase config
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState(File[""]);
  const [importedFile, setImportedFile] = useState();

  // type dupType= {
  //   fileName: string;
  //   serId: string;
  //   lastModified?: string;
  //   size?: string;
  //   duplicate?: boolean;
  // };

  interface dupType extends File {
    fileName: string;
    name: string;
    serId: string;
    lastModified: number;
    lastModifiedDate: string;
    size: number;
    duplicate?: boolean;
  }
  const [duplicates, setDuplicates] = useState([{} as dupType]);
  const [uploading, setUploading] = useState([{} as dupType]);
  const dupArray = useArray([]);

  // let importedFile: any;

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

    const dupsMap = iterable.map(async (file) => {
      return await compareSeriesWithDb(file as dupType);
    });

    const mappedArrays = Promise.all(dupsMap);
    return await mappedArrays;
  };

  //
  const compareSeriesWithDb = async (file: dupType) => {
    // Get existing series's (fileInfo's only) that belong to user
    const existingInfos = await getExistingFileInfos();

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
      // TODO just call it name on imoprt
      file.fileName = file.name;
      // need to return as array
      return file;
    }
  };
  useEffect(() => {
    // console.log("duplicates: ", duplicates);
  }, [duplicates]);

  return (
    <Box className={style.upload}>
      <Heading color="blue.400" mb={3}>
        Select File
      </Heading>

      <Divider my={4} />
      {}
      <Flex gap={4} pl={3}>
        <Button
          variant={"outline"}
          boxShadow="md"
          colorScheme={"blue"}
          onClick={async () => {
            const fileList = await showDialog();
            const checked = await checkSeries(fileList);
            console.log("checked: ", checked);
            let dups = [{}];
            let ups = [{}];
            checked.forEach((item) => {
              if (item.duplicate) {
                // console.log("checked duplicates: ", duplicates);
                dups.push(item);
                // return;
              } else {
                ups.push(item);
                // return;
              }
            });
            console.log("dups: ", dups);
            console.log("ups: ", ups);
            setDuplicates(dups as dupType[]);
            setUploading(ups as dupType[]);
            // populateWithAll(fileList);
          }}
        >
          Choose File(s)
        </Button>
      </Flex>

      {console.log("duplicates: ", duplicates)}

      {duplicates &&
        duplicates.find((dup) => {
          if (dup.size) return true;
        }) && (
          <Box my={3}>
            <Box>
              <Heading as="h3" color="blue.300" fontSize={"md"}>
                Duplicate files
              </Heading>
              <Divider my={3} />
            </Box>
            <Box>
              <List>
                {duplicates.map((dup) => (
                  <Fragment>
                    {dup.size && (
                      <ListItem
                        py={1}
                        borderBottom="1px solid"
                        borderBottomColor={"blue.100"}
                      >
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text>{dup.fileName}</Text>
                            {dup.lastModified && (
                              <Text fontSize={"xs"} color={"gray.200"}>
                                {new Date(
                                  dup.lastModified
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  dup.lastModified
                                ).toLocaleTimeString()}
                              </Text>
                            )}
                          </Box>
                          <Box>
                            <Tooltip
                              label="Overwrite existing"
                              hasArrow
                              bg="blue.300"
                              placement="bottom-start"
                            >
                              <IconButton
                                aria-label="Overwrite existing"
                                icon={<MdControlPointDuplicate />}
                                size={"sm"}
                                variant="ghost"
                                colorScheme={"blue"}
                              />
                            </Tooltip>
                            <Tooltip
                              label="Remove from Upload"
                              hasArrow
                              bg="blue.300"
                              placement="bottom-start"
                            >
                              <IconButton
                                aria-label="Remove from Upload"
                                icon={<MdClear />}
                                size={"sm"}
                                variant="ghost"
                                colorScheme={"blue"}
                                onClick={(e) => {
                                  // e.preventDefault();
                                  // removeEvent(event.id);
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Flex>
                      </ListItem>
                    )}
                  </Fragment>
                ))}
              </List>
            </Box>
          </Box>
        )}
      {/* ////////////////////////////////////////////////////////////////////////// */}
      {uploading &&
        uploading.find((dup) => {
          if (dup.size) return true;
        }) && (
          <Box>
            <Box>
              <Heading as="h3" color="blue.300" fontSize={"md"}>
                New FIles
              </Heading>
              <Divider my={3} />
            </Box>
            <Box>
              <List>
                {uploading.map((dup) => (
                  <Fragment>
                    {dup.size && (
                      <ListItem
                        py={1}
                        borderBottom="1px solid"
                        borderBottomColor={"blue.100"}
                      >
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Box>
                            <Text>{dup.fileName}</Text>
                            {dup.lastModified && (
                              <Text fontSize={"xs"} color={"gray.200"}>
                                {new Date(
                                  dup.lastModified
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  dup.lastModified
                                ).toLocaleTimeString()}
                              </Text>
                            )}
                          </Box>
                          <Box>
                            <Tooltip
                              label="Overwrite existing"
                              hasArrow
                              bg="blue.300"
                              placement="bottom-start"
                            >
                              <IconButton
                                aria-label="Overwrite existing"
                                icon={<MdControlPointDuplicate />}
                                size={"sm"}
                                variant="ghost"
                                colorScheme={"blue"}
                              />
                            </Tooltip>
                            <Tooltip
                              label="Remove from Upload"
                              hasArrow
                              bg="blue.300"
                              placement="bottom-start"
                            >
                              <IconButton
                                aria-label="Remove from Upload"
                                icon={<MdClear />}
                                size={"sm"}
                                variant="ghost"
                                colorScheme={"blue"}
                                onClick={(e) => {
                                  // e.preventDefault();
                                  // removeEvent(event.id);
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Flex>
                      </ListItem>
                    )}
                  </Fragment>
                ))}
              </List>
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default Upload;
