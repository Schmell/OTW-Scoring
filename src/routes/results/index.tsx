import { Box, Divider, Heading, Progress } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { collection, doc } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
// customs
import useStorage from "../../hooks/useStorage";
import { compConverter } from "../../model/Comp";
import FleetsTables from "./components/FleetsTables";
import { Page } from "../../components/page/Page";
import PageHead from "../../components/page/pageHead";

export default function Result(props) {
  const { setHeaderTitle, seriesId, raceId, ...rest } = props;
  //
  const [raceName, setRaceName] = useState("");
  setHeaderTitle(raceName);

  const [racesIds] = useStorage("racesArray");
  const racesArray = racesIds.split(",");

  const position = racesArray.indexOf(raceId);

  const [selectedRace, setSelectedRace] = useState(position);

  const [tableData, setTableData] = useState([{}]);

  const seriesRef = doc(db, "series", seriesId);
  const raceRef = doc(seriesRef, "/races", racesArray[selectedRace]);
  const [raceDoc, raceLoading] = useDocumentData(raceRef);
  const compsRef = collection(seriesRef, "/comps").withConverter(compConverter);
  const [compsCol, compsLoading, _compsError] = useCollectionData(compsRef);

  const [serInfo] = useDocumentData(seriesRef);

  const getSeriesData = async () => {
    if (!compsLoading) {
      const mapper =
        compsCol &&
        compsCol.map(async (item) => {
          await item.mergeResult?.(racesArray[selectedRace]);
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
    // setReady(false);
    const seriesData = await getSeriesData();
    let tableData: object[] = [];
    seriesData &&
      seriesData.forEach((result) => {
        const fixedResult = replaceEmptyStringWithCode(result);
        const { comp, results } = fixedResult;
        tableData.push({ ...results[0], ...comp });
      });
    // setReady(true);
    return tableData;
  };

  useEffect(() => {
    (async () => {
      const result = await makeTableData();
      setTableData(result);
    })();
  }, [compsCol, selectedRace]);

  useEffect(() => {
    (async () => {
      let name: string;
      const rdName = await raceDoc?.name;
      if (!rdName) {
        const rdRank = await raceDoc?.rank;
        if (!rdRank) return;
        setRaceName(`Race ${rdRank}`);
      } else {
        setRaceName(rdName);
      }
    })();
  }, [raceDoc, tableData]);

  const data = useMemo(() => {
    return tableData;
  }, [tableData]);

  return (
    <Page>
      {compsLoading ? (
        <PageHead title={raceName}></PageHead>
      ) : (
        data && (
          <Fragment>
            <FleetsTables
              race={raceDoc}
              tableData={tableData}
              serInfo={serInfo}
              racesArray={racesArray}
              selectedRace={selectedRace}
              setSelectedRace={setSelectedRace}
              seriesId={seriesId}
              {...rest}
            />
          </Fragment>
        )
      )}
    </Page>
  );
}
