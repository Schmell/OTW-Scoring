import { collection } from "firebase/firestore";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Column } from "react-table";
import FlexTable from "../components/seriesTable/flexTable";
import { compConverter } from "../model/Comp";
import { raceConverter } from "../model/Race";
import { auth, eRef } from "../util/firebase-config";
import "./seriesTable/seriesTable.css";
import { SignIn } from "./SignIn";

export interface Props {
  columns: Array<Column<object>>;
  data: Array<object>;
  resultType?: string;
  setResultType?: Function;
}

const SeriesTable: FunctionalComponent = () => {
  const [user, userLoading, _userError] = useAuthState(auth);

  const raceRef = collection(eRef, "races").withConverter(raceConverter);

  const [races, racesLoading] = useCollectionData(raceRef);
  const [resultType, setResultType] = useState("corrected");

  const [tableData, setTableData] = useState([{}]);

  // should be a function that returns race columns
  // requires races
  const raceColumns = () => {
    let race: Column<object>[] | [] = [];
    if (!racesLoading) {
      // console.log('races: ',races )
      race = races!.map((item, idx) => {
        const mapped = {
          Header: `R${item.rank}`,
          accessor: `results[${idx}].${resultType}`,
          disableResizing: true,
          maxWidth: 55,

          // this is to get points to sort properly and maybe other data types in the future
          sortType: (rowA: any, rowB: any, columnId: any, desc: any) => {
            if (columnId.includes(".points")) {
              if (+rowA.values[columnId] > +rowB.values[columnId]) {
                //int
                return 1;
              }
              if (+rowB.values[columnId] > +rowA.values[columnId]) {
                //int
                return -1;
              }
              return 0;
            }

            if (!rowA.values[columnId] && !rowB.values[columnId]) {
              return 0;
            }
            if (!rowA.values[columnId]) {
              return desc ? -1 : 1;
            }
            if (!rowB.values[columnId]) {
              return desc ? 1 : -1;
            }

            return rowA.values[columnId].localeCompare(rowB.values[columnId]);
          },
        };
        return mapped;
      });
    }
    return race;
  };

  // refactor to new file
  const columns = useMemo(
    () => [
      {
        Header: "Competitors",
        disableResizing: true,

        columns: [
          {
            Header: "#",
            accessor: "comp.rank",
            maxWidth: 44,
            disableResizing: true,
          },
          {
            Header: "Fleet",
            accessor: "comp.fleet",
            maxWidth: 90,
            disableResizing: true,
          },
          {
            Header: "Boat",
            accessor: "comp.boat",
            maxWidth: 110,
            disableResizing: true,
          },
          {
            Header: "Skipper",
            accessor: "comp.helmname",
            maxWidth: 114,
          },
          {
            Header: "Rating",
            accessor: "comp.rating",
            maxWidth: 54,
            disableResizing: true,
          },
        ],
      },
      {
        Header: "Races",
        columns: [...raceColumns()],
      },

      {
        Header: "Points",
        disableResizing: true,
        columns: [
          {
            Header: "Nett",
            accessor: "comp.nett",
            disableResizing: true,
            width: 54,
          },
          {
            Header: "Total",
            accessor: "comp.total",
            disableResizing: true,
            width: 54,
          },
        ],
      },
    ],
    [resultType, tableData]
  );

  const compsRef = collection(eRef, "/comps").withConverter(compConverter);
  const [compsCol, compsLoading, _compsError] = useCollectionData(compsRef);

  const getSeriesData = async () => {
    if (!compsLoading) {
      const mapper =
        compsCol &&
        compsCol.map(async (item) => {
          await item.mergeResults?.();
          return item;
        });

      const mapped = await Promise.all(mapper!);
      return mapped;
    }
  };

  const makeTableData = async () => {
    const seriesData = await getSeriesData();
    let tableData: object[] = [];

    seriesData &&
      seriesData.forEach((result) => {
        tableData.push({ ...result });
      });

    return tableData;
  };
  //

  useEffect(() => {
    (async () => {
      const result = await makeTableData();
      setTableData(result);
    })();
  }, []);

  const data = useMemo(() => {
    return tableData;
  }, [tableData]);
  //
  return (
    <Fragment>
      {!userLoading && user && data ? (
        <Fragment>
          <FlexTable
            columns={columns}
            data={data}
            resultType={resultType}
            setResultType={setResultType}
          />
        </Fragment>
      ) : (
        <SignIn />
      )}
    </Fragment>
  );
};

export default SeriesTable;
