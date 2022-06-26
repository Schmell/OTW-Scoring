import {
  Box,
  Heading,
  Divider,
  List,
  ListItem,
  Flex,
  Tooltip,
  IconButton,
  Text,
  useRadioGroup,
  HStack,
  Stack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import {
  MdControlPointDuplicate,
  MdContentCopy,
  MdClear,
  MdDone,
} from "react-icons/md";
import { CustomRadio } from "./CUstomRadio";
import { DuplicateOptions } from "./DuplicateOptions";
import { importFileObj } from "./importFileObj";
//   import { fileType } from "./fileType";

interface uploadProps {
  listItems: importFileObj[];
  listState: importFileObj[];
  setListState: any;
  duplicates: boolean;
}

const ImportList = ({
  listItems,
  listState,
  setListState,
  duplicates,
}: uploadProps) => {
  const handleChange = () => {};

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "copy",
    // onChange: handleChange,
  });

  // const handleMakeAcopy = (item) => {
  //   console.log("item: ", item);
  //   const filtered = listState.filter((ls) => {
  //     if (ls.serId === item.serId) return true;
  //   });
  //   console.log("filtered: ", filtered);
  //   filtered[0].fileName = "copy-" + filtered[0].fileName;
  //   filtered[0].serId = "";
  //   const merged = {
  //     ...listState,
  //     ...filtered,
  //   };
  //   console.log("merged: ", merged);

  //   setListState(merged as fileType[]);
  //   return;
  // };

  return (
    <Fragment>
      {listItems &&
        listItems.find((fileObj) => {
          if (fileObj.name) return true;
        }) && (
          <Box my={3}>
            <Box>
              <Heading as="h3" color="blue.300" fontSize={"lg"}>
                {duplicates ? "Duplicate files" : "New Files"}
              </Heading>
              <Divider my={3} />
            </Box>
            <Box>
              <List>
                {listItems.map((item) => (
                  <Fragment>
                    {item.name && (
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
                            <Text fontSize={"lg"}>{item.name}</Text>
                            {item.file.lastModified && (
                              <Text fontSize={"xs"} color={"gray.600"}>
                                {new Date(
                                  item.file.lastModified
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  item.file.lastModified
                                ).toLocaleTimeString()}
                              </Text>
                            )}
                          </Box>
                          <Flex alignItems={"center"}>
                            {item.duplicate && <DuplicateOptions item={item} />}
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
                                onClick={() => {
                                  const filtered = listState.filter((ls) => {
                                    if (ls.name !== item.name) return true;
                                  });

                                  setListState(filtered);
                                }}
                              />
                            </Tooltip>
                          </Flex>
                        </Flex>
                      </ListItem>
                    )}
                  </Fragment>
                ))}
              </List>
            </Box>
          </Box>
        )}
    </Fragment>
  );
};

export default ImportList;
