import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { collection, doc } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import { Box, Divider, Flex, Heading, Progress, Skeleton, Spinner, Text } from "@chakra-ui/react";

import { compConverter } from "../../model/Comp";
import FleetsTables from "./components/FleetsTables";

export default function Result({ seriesId, raceId, setHeaderTitle, raceName }) {
  setHeaderTitle(raceName);

  const [tableData, setTableData] = useState([{}]);

  const seriesRef = doc(db, "series", seriesId);
  const compsRef = collection(seriesRef, "/comps").withConverter(compConverter);
  const [serInfo, serInfoLoading] = useDocumentData(seriesRef);

  const [compsCol, compsLoading, _compsError] = useCollectionData(compsRef);

  const getSeriesData = async () => {
    if (!compsLoading) {
      const mapper =
        compsCol &&
        compsCol.map(async (item) => {
          await item.mergeResult?.(raceId);
          return item;
        });

      const mapped = await Promise.all(mapper!);
      return mapped;
    }
  };

  // function should take in tableData and render a table for each fleet
  const replaceEmptyStringWithCode = (result) => {
    let code = "";

    if (result.results[0].rcod) {
      code = result.results[0].rcod;
    } else {
      code = "---";
    }

    if (result.results[0].corrected === "") result.results[0].corrected = code;
    if (result.results[0].finish === "") result.results[0].finish = code;
    if (result.results[0].elapsed === "") result.results[0].elapsed = code;
    return result;
  };

  const makeTableData = async () => {
    const seriesData = await getSeriesData();

    let tableData: object[] = [];

    seriesData &&
      seriesData.forEach((result) => {
        const fixedResult = replaceEmptyStringWithCode(result);
        const { comp, results } = fixedResult;
        tableData.push({ ...results[0], ...comp });
      });

    return tableData;
  };

  useEffect(() => {
    (async () => {
      const result = await makeTableData();
      setTableData(result);
    })();
  }, [compsCol]);

  const data = useMemo(() => {
    return tableData;
  }, [tableData]);

  return (
    <Fragment>
      {compsLoading ? (
        // <Flex justify={"center"} pt={16}>
        //   <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        // </Flex>
        <Fragment>
          <Box px={6}>
            <Heading color="blue.400" size="xl">
              Loading...
            </Heading>
          </Box>
          <Divider my={3} border={4} />
          <Progress size="xs" isIndeterminate top={-4} />
        </Fragment>
      ) : (
        data && (
          <Fragment>
            <FleetsTables tableData={tableData} serInfo={serInfo} raceId={raceId} raceName={raceName} />
          </Fragment>
        )
      )}
    </Fragment>
  );
}
