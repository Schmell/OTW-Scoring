import { FC, useCallback, useEffect, useMemo, useState } from "preact/compat";
import { Fragment, h } from "preact";
// import DataTable from "../../components/datatable/DataTable";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../util/firebase-config";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
// import multiColumnSort from "multi-column-sort";
import { createTheme } from "react-data-table-component";
import { TableExample } from "../../components/datatable/multiDataTable";

const columns = [
  {
    name: "Competitors",
    selector: (row: any) => row.boat,
    sortable: true,
  },
  {
    name: "Fleet",
    selector: (row: any) => row.fleet,
    sortable: true,
  },
  //   {
  //     name: "Finished",
  //     selector: (row: any) => row.finish,
  //     sortable: true,
  //   },
  {
    name: "Elapsed",
    selector: (row: any) => row.elapsed,
    sortable: true,
  },
  {
    name: "Position",
    selector: (row: any) => row.points,
    sortable: true,
  },
];

interface IResultsProps {
  seriesid?: string;
  raceid?: string;
}

const Results: FC<IResultsProps> = ({ seriesid, raceid }) => {
  // get comps and results
  // merge them together
  // add them to the table data
  const seriesRef = doc(db, `events/${seriesid}`);
  const [comps] = useCollectionData(collection(seriesRef, "comps"));

  let resultArray: any = [];
  const mergeCompWithResult = () => {
    let newResult = {};
    if (results) {
      results.forEach((result) => {
        const comp = comps?.filter((comp) => comp.compid === result.compid);
        if (comp) {
          newResult = { ...result, ...comp[0] };
          resultArray.push(newResult);
        }
      });
    }
    return resultArray;
  };

  const resultQuery = query(
    collection(seriesRef, "results"),
    where("raceid", "==", raceid)
  );
  const [results] = useCollectionData(resultQuery);
  const [gridData, setGridData] = useState(mergeCompWithResult());

  useEffect(() => {
    const gd = mergeCompWithResult();

    setGridData(gd);
  }, [results]);

  const actions = <button key="add">Add</button>;

  createTheme("solarized", {
    text: {
      primary: "#000",
      secondary: "#fff",
    },
    background: {
      default: "#fff",
    },
    highlight: {
      default: "#f9f9f9",
    },
    context: {
      background: "#cb4b16",
      text: "#FFFFFF",
    },
    divider: {
      default: "#073642",
    },
    button: {
      default: "#2aa198",
      hover: "rgba(0,0,0,.08)",
      focus: "rgba(255,255,255,.12)",
      disabled: "rgba(255, 255, 255, .34)",
    },
    sortFocus: {
      default: "#2aa198",
      background: "#fff",
    },
    striped: {
      default: "#eaeaea",
    },
  });

  const handleRowClicked = (row: any) => {
    const updatedData = gridData!.map((item: any) => {
      if (row.id !== item.id) {
        console.log("item: ", item);

        return { ...item, toggleSelected: null };
      }

      return {
        ...item,
        toggleSelected: !item.toggleSelected,
      };
    });

    setGridData(updatedData);
  };

  const conditionalRowStyles = [
    {
      when: (row: any) => {
        return row.toggleSelected;
      },
      style: {
        backgroundColor: "cornflowerblue",
        userSelect: "none",
      },
    },
  ];

  return (
    <Fragment>
      <h1>Results</h1>
      <TableExample
      // columns={columns}
      // data={gridData!}
      // theme="solarized"
      // selectableRows
      // striped
      // responsive
      // // highlightOnHover // how to change the colors???
      // onRowClicked={handleRowClicked}
      // conditionalRowStyles={conditionalRowStyles}
      />
    </Fragment>
  );
};

export default Results;
