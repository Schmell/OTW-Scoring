import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useReducer, useState } from "preact/compat";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import "./style.css";

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useTableInstance,
} from "@tanstack/react-table";

import { Person, makeData } from "./makeData";
import ResultTable from "./components/ResultTable";

type ResultRow = {
  boat: string;
  comp: string;
  points: string;
  finish: string;
  start: string;
  elapsed: string;
  corrected: string;
};

export default function Result({ seriesId, raceId }) {
  // Ok this component shloud be loaded only after the comp/resu;t object is created

  const seriesRef = doc(db, "series", seriesId);
  const compRef = collection(seriesRef, "comps");
  const [comps, compsLoading] = useCollection(compRef);

  const resultsRef = collection(seriesRef, "results");
  const raceQuery = query(resultsRef, where("raceid", "==", raceId));
  const [results, resultsLoading] = useCollection(raceQuery);

  const [data, setData] = useState<any>();

  // console.log("compResults: ", compResults);
  // console.log("makeData: ", makeData(10));

  // const data = compResults;
  // const refreshData = () => setData(() => makeData(10));

  // this shuld be a function that is called before render
  const compResults = comps?.docs.map((comp) => {
    // console.log("comp: ", comp.data());
    const result = results?.docs.find((res) => {
      // console.log("res: ", res.data());
      if (res.data().compid === comp.data().compid) {
        return true;
      }
    });
    // console.log("result: ", result?.data());
    return { ...comp.data(), ...result?.data() };
  });
  console.log("compResults: ", compResults);
  // setData(compResults);

  return (
    <Fragment>
      {data && (
        <h1>data is here</h1>
        // <ResultTable data={data} />
      )}
    </Fragment>
  );
}

// export default Results;
