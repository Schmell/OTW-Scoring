import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Heading,
  List,
  ListItem,
  Switch,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { DuplicateOptions } from "./DuplicateOptions";
import { importProps } from "./importTypes";
// Icons
import ClearIcon from "@mui/icons-material/Clear";
import ToolIconButton from "../../components/generic/ToolIconButton";

export default function ImportList({
  listItems,
  listState,
  setListState,
  duplicates,
  setCopy,
  setPublic,
}: importProps) {
  // console.log("listItems ", listItems);
  return (
    <Fragment>
      {listItems &&
        listItems.find((fileObj) => {
          if (fileObj.name) return true;
        }) && (
          <Box my={3} mx={4}>
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

                          <Flex alignItems="center" gap={2}>
                            <Text fontSize="xs" color="gray.400">
                              Public:
                            </Text>
                            <Switch
                              defaultChecked
                              onChange={(e) => {
                                setPublic(e.target.checked);
                              }}
                            />
                            {item.duplicate && (
                              <DuplicateOptions item={item} setCopy={setCopy} />
                            )}
                            <ToolIconButton
                              icon={ClearIcon}
                              aria-label="Remove from Upload"
                              variant="ghost"
                              onClick={() => {
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
