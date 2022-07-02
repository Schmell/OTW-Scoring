import {
  TableContainer,
  // Table,
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
import { db } from "../../../util/firebase-config";
import "./style.css";

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useTableInstance,
} from "@tanstack/react-table";

type ResultRow = {
  boat: string;
  comp: string;
  points: string;
  finish: string;
  start: string;
  elapsed: string;
  corrected: string;
};

export default function ResultTable({ data }) {
  // Ok this component shloud be loaded only after the comp/resu;t object is created
  let table = createTable().setRowType<ResultRow>();
  // const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState<SortingState>([]);

  // console.log("compResults: ", compResults);
  // console.log("makeData: ", makeData(10));

  // const data = compResults;

  const columns = useMemo(
    () => [
      table.createGroup({
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          table.createDataColumn("boat", {
            cell: (info) => info.getValue(),
            header: () => <span>Boat</span>,
            footer: (props) => props.column.id,
          }),
          table.createDataColumn("helmname", {
            cell: (info) => info.getValue(),
            header: () => <span>Helm</span>,
            footer: (props) => props.column.id,
          }),
        ],
      }),
      table.createGroup({
        header: "Results",
        footer: (props) => props.column.id,
        columns: [
          table.createDataColumn("points", {
            cell: (info) => info.getValue(),
            header: () => "Points",
            footer: (props) => props.column.id,
          }),
          table.createDataColumn("start", {
            cell: (info) => info.getValue(),
            header: () => "Start",
            footer: (props) => props.column.id,
          }),
          table.createDataColumn("finish", {
            cell: (info) => info.getValue(),
            header: () => "Finish",
            footer: (props) => props.column.id,
          }),
          table.createDataColumn("elapsed", {
            cell: (info) => info.getValue(),
            header: () => "Elapsed",
            footer: (props) => props.column.id,
          }),
          table.createDataColumn("corrected", {
            cell: (info) => info.getValue(),
            header: () => "Corrected",
            footer: (props) => props.column.id,
          }),
          table.createGroup({
            header: "Totals",
            columns: [
              table.createDataColumn("nett", {
                header: "Nett",
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id,
              }),
              table.createDataColumn("total", {
                header: "Total",
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id,
              }),
            ],
          }),
        ],
      }),
    ],
    []
  );

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Fragment>
      {data && (
        <div className="p-2">
          <div className="h-2" />
          <table>
            <thead>
              {instance.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {header.renderHeader()}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {instance
                .getRowModel()
                .rows.slice(0, 10)
                .map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return <td key={cell.id}>{cell.renderCell()}</td>;
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div>{instance.getRowModel().rows.length} Rows</div>
          <div>
            {/* <button onClick={() => rerender()}>Force Rerender</button> */}
          </div>
          <div>
            {/* <button onClick={() => refreshData()}>Refresh Data</button> */}
          </div>
          <pre>{JSON.stringify(sorting, null, 2)}</pre>
        </div>
      )}
    </Fragment>
  );
}

// export default Results;
