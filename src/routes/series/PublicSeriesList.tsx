import {
  Box,
  Heading,
  Progress,
  VStack,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";

interface PublicSeriesListProps {}

export default function PublicSeriesList(props) {
  const {} = props;
  const seriesRef = collection(db, "series");
  const seriesQuery = query(seriesRef, where("__public", "==", true));
  const [series, seriesLoading] = useCollection(seriesQuery);

  const [_seriesId, setSeriesId] = useStorage("seriesId", {
    initVal: "",
    bool: false,
  });
  const [_raceId, setRaceId] = useStorage("raceId", {
    initVal: "",
    bool: false,
  });

  return (
    <Fragment>
      {seriesLoading ? (
        <Progress size="xs" isIndeterminate />
      ) : (
        <Box mb={8}>
          <Heading size={"md"} ml={4} mb={2}>
            Public Series
          </Heading>
          <VStack align={"left"} mx={4}>
            {series?.docs.map((series) => (
              <Box
                my={2}
                p={2}
                pl={4}
                cursor="pointer"
                _hover={{
                  background: "blue.100",
                  // color: "teal.500",
                }}
                onClick={() => {
                  setSeriesId(series.id);
                  route(`/races`);
                }}
              >
                {series.data().event}
                <Text fontSize="xs">{series.data().venue}</Text>
                <Divider mt={1} />
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Fragment>
  );
}
