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
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import {
  MdControlPointDuplicate,
  MdContentCopy,
  MdClear,
} from "react-icons/md";
import { fileType } from "./fileType";

interface uploadProps {
  listItems: fileType[];
  listState: fileType[];
  setListState: any;
  duplicates: boolean;
}

const UploadList = ({
  listItems,
  listState,
  setListState,
  duplicates,
}: uploadProps) => {
  const handleMakeAcopy = (item) => {
    console.log("item: ", item);
    const filtered = listState.filter((ls) => {
      if (ls.serId === item.serId) return true;
    });
    console.log("filtered: ", filtered);
    filtered[0].fileName = "copy-" + filtered[0].fileName;
    filtered[0].serId = "";
    const merged = {
      ...listState,
      ...filtered,
    };
    console.log("merged: ", merged);

    setListState(merged as fileType[]);
    return;
  };

  return (
    <Fragment>
      {listItems &&
        listItems.find((fileObj) => {
          if (fileObj.size) return true;
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
                    {item.size && (
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
                            <Text fontSize={"lg"}>{item.fileName}</Text>
                            {item.lastModified && (
                              <Text fontSize={"xs"} color={"gray.600"}>
                                {new Date(
                                  item.lastModified
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  item.lastModified
                                ).toLocaleTimeString()}
                              </Text>
                            )}
                          </Box>
                          <Box>
                            {item.duplicate && (
                              <Fragment>
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
                                  label="Make a copy"
                                  hasArrow
                                  bg="blue.300"
                                  placement="bottom-start"
                                >
                                  <IconButton
                                    aria-label="Make a copy"
                                    icon={<MdContentCopy />}
                                    size={"sm"}
                                    variant="ghost"
                                    colorScheme={"blue"}
                                    onClick={() => {
                                      handleMakeAcopy(item);
                                    }}
                                  />
                                </Tooltip>
                              </Fragment>
                            )}

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
                                  const filtered = listState.filter(
                                    (ls: File) => {
                                      if (ls.name !== item.name) return true;
                                    }
                                  );

                                  setListState(filtered);
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
    </Fragment>
  );
};

export default UploadList;
