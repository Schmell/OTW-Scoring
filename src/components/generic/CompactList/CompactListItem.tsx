import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { useAsync } from "react-use";
import { Series } from "../../../model/Series";
import ToolIconButton from "../ToolIconButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import { useAsync } from "../../../hooks/useAsync";

interface CompactListItemProps {
  title: string;
  children: h.JSX.Element;
  subText: string;
  item: QueryDocumentSnapshot<DocumentData>;
  forward: string;
  snap: Series;
}

export default function CompactListItem(props: CompactListItemProps) {
  const { title, children, subText, item, forward, snap, ...rest } = props;

  const getEvent = async () => {
    return await snap?.getEvent!();
  };
  const { value: event, loading: eventLoading } = useAsync(getEvent);

  return (
    <Box boxShadow="lg">
      <Grid templateColumns="repeat(6, 1fr)" bg="white" px={4} py={1}>
        <GridItem colSpan={5}>
          <Text fontSize={"lg"} pt={2}>
            {title}
          </Text>
          <Divider />
        </GridItem>
        <GridItem colStart={6} colEnd={7}>
          <Flex justifyContent={"right"} w="full" pr={2}>
            <ToolIconButton
              aria-label="View Races"
              icon={VisibilityOutlinedIcon}
              variant="ghost"
              onClick={() => {
                route(``);
              }}
            />
          </Flex>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize="xs" pt={4} py={2}>
            {subText}
          </Text>
        </GridItem>
        <GridItem colStart={4} colEnd={7}>
          <Text fontSize="xs" align={"right"} pr={2} py={2}>
            {event?.data()?.organization}
          </Text>
        </GridItem>
      </Grid>
    </Box>
    // <Box
    //   bg={useColorModeValue("white", "blackAlpha.500")}
    //   borderBottomWidth={4}
    //   borderColor={useColorModeValue("gray.200", "blackAlpha.400")}
    //   _hover={useColorModeValue(
    //     { background: "blue.100", borderColor: "blue.400" },
    //     { background: "blue.800", borderColor: "blue.400" }
    //   )}
    // >
    //   <Flex justifyContent="space-between" alignItems="center" gap={2} px={4}>
    //     <Flex flexDirection="column" w="full" p={2} userSelect={"none"}>
    //       <Box
    //         w="full"
    //         cursor={"pointer"}
    //         onClick={() => {
    //           route(forward);
    //         }}
    //       >
    //         <Text px={4} fontSize="lg">
    //           {title}
    //         </Text>
    //       </Box>
    //       <Divider mb={2} />

    //       <Flex justifyContent={"space-between"}>
    //         <Box
    //           w="full"
    //           cursor={"pointer"}
    //           onClick={() => {
    //             route(`/events/event/${event?.id}`);
    //           }}
    //         >
    //           <Text px={4} fontSize="xs">
    //             {event?.data()?.name}
    //           </Text>
    //         </Box>
    //         <Box
    //           w="full"
    //           cursor={"pointer"}
    //           onClick={() => {
    //             route(`/organization/${event?.data()?.organization}`);
    //           }}
    //         >
    //           <Text px={4} fontSize="xs">
    //             {subText}
    //           </Text>
    //         </Box>
    //       </Flex>
    //     </Flex>
    //     {children}
    //   </Flex>
    // </Box>
  );
}
