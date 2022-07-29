import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { collection, doc } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";

import { compConverter } from "../../model/Comp";
import FleetsTables from "./components/FleetsTables";

export default function Result({ seriesId, raceId, setHeaderTitle }) {
  setHeaderTitle("Results");
  // console.log("raceId: ", raceId);
  const seriesRef = doc(db, "series", seriesId);

  const [tableData, setTableData] = useState([{}]);
  // const [seriesInfo, setSeriesInfo] = useState([{}]);

  const compsRef = collection(seriesRef, "/comps").withConverter(compConverter);
  const [compsCol, compsLoading, _compsError] = useCollectionData(compsRef);
  const [serInfo, serInfoLoading] = useDocumentData(seriesRef);

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
      {!compsLoading && data && (
        <Fragment>
          <FleetsTables tableData={tableData} serInfo={serInfo} raceId={raceId} />
        </Fragment>
      )}
    </Fragment>
  );
}
