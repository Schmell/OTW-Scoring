import { Flex, Box, Divider, Text, useColorModeValue } from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";

interface SiteListTextProps {
  children: any;
  item: QueryDocumentSnapshot<DocumentData>;
  forward: string;
  setStorage: (id: string) => void;
  textItems: {
    head: string;
    sub: string;
    foot: string;
  };
  // data: any;
}

export function SiteListText({
  children,
  setStorage,
  item,
  forward,
  textItems,
}: SiteListTextProps) {
  return (
    <Fragment>
      <Flex justifyContent="space-between">
        <Box
          w="80%"
          mx={2}
          cursor={"pointer"}
          onClick={() => {
            setStorage(item.id);
            route(`/${forward}`);
          }}
        >
          <Text fontSize={"xl"}>{textItems.head}</Text>
          <Divider mb={2} />
          <Text fontSize="lg" color={useColorModeValue("gray.500", "gray.300")}>
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
