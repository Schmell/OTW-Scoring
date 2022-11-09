import {
  Flex,
  Box,
  Divider,
  Text,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";

interface SiteListTextProps {
  children: any;
  item: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>;
  forward: string;
  setStorage?: (id: string) => void;
  textItems: {
    head: string;
    sub: string;
    foot: string;
  };
  action?: () => void;
  // data: any;
}

export function SiteListText({
  children,
  setStorage,
  item,
  forward,
  textItems,
  action,
}: SiteListTextProps) {
  return (
    <Fragment>
      <Flex justifyContent="space-between">
        <Box
          w="80%"
          mx={2}
          cursor="pointer"
          onClick={
            action
              ? action
              : () => {
                  setStorage?.(item.id);
                  route(`/${forward}`);
                }
          }
        >
          <Flex alignItems="center" gap={2}>
            <Text fontSize="xl">{textItems.head}</Text>
            {item.data()?.__public !== undefined && !item.data()?.__public && (
              <Badge ml={4} colorScheme="red" variant="outline">
                Private
              </Badge>
            )}
          </Flex>

          <Divider mb={2} />

          <Text
            fontSize="lg"
            my={2}
            color={useColorModeValue("gray.500", "gray.300")}
          >
            {textItems.sub}
          </Text>

          <Text fontSize="md" color={useColorModeValue("gray.500", "gray.300")}>
            {textItems.foot}
            {/* <Divider />
            {item.id} */}
          </Text>
        </Box>
        {children}
      </Flex>
    </Fragment>
  );
}
