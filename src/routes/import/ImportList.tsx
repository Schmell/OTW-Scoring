import {
  Box,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { DuplicateOptions } from "./DuplicateOptions";
import { importProps } from "./importTypes";
// Icons
import ClearIcon from "@mui/icons-material/Clear";
import ToolIconBtn from "../../components/generic/ToolIconBtn";



export default function ImportList({
  listItems,
  listState,
  setListState,
  duplicates,
  setCopy,
}: importProps) {

  return (
    <Fragment>
      {listItems &&
        listItems.find((fileObj) => {
          if (fileObj.name) return true;
        }) && (
          <Box my={3}>
            <Box>
              <Heading as="h3" color="blue.300" fontSize="lg">
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
                        borderBottomColor="blue.100"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Text fontSize="lg">{item.name}</Text>
                            {item.file.lastModified && (
                              <Text fontSize="xs" color="gray.600">
                                {new Date(
                                  item.file.lastModified
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  item.file.lastModified
                                ).toLocaleTimeString()}
                              </Text>
                            )}
                          </Box>
                          <Flex alignItems="center">
                            {item.duplicate && (
                              <DuplicateOptions item={item} setCopy={setCopy} />
                            )}
                            <ToolIconBtn
                              icon={ClearIcon}
                              label="Remove from Upload"
                              variant="ghost"
                              action={() => {
                                const filtered = listState.filter((ls) => {
                                  if (ls.name !== item.name) return true;
                                });
                                setListState(filtered);
                              }}
                            />
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
}
