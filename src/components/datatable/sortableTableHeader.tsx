// import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { h } from "preact";
import "./dataTable.css";
// import { useMemo } from "preact/hooks";
// import { TableColumn } from "react-data-table-component";
import { dataList, TableData } from "./fetchData";
import {
  SortingConfiguration,
  SortingType,
  TableDataComparable,
} from "./multiDataTable";

interface SortableHeaderProps {
  sortBy: (string: any, compareFunction: TableDataComparable) => void;
  sortConfig: SortingConfiguration[];
}

interface TableColumn {
  label: string;
  property: string;
  compareFunction: (a: TableData, b: TableData) => number;
}

export const SortableHeader = ({ sortBy, sortConfig }: SortableHeaderProps) => {
  // const { headerCell, sortLabel } = useStyles();

  const CompareByEquality =
    (column: keyof TableData) => (a: TableData, b: TableData) => {
      if (a[column] === b[column]) {
        return 0;
      } else {
        if (a[column] > b[column]) {
          return 1;
        }
        return -1;
      }
    };

  const tableColumn = [
    {
      label: "Name",
      property: "name",
      compareFunction: (a: TableData, b: TableData) => {
        return a["name"].localeCompare(b["name"] as string);
      },
    },
    {
      label: "Hours",
      property: "hours",
      compareFunction: CompareByEquality("hours"),
    },
    {
      label: "Date",
      property: "startDate",
      compareFunction: CompareByEquality("startDate"),
    },
    {
      label: "Department",
      property: "department",
      compareFunction: CompareByEquality("department"),
    },
  ] as TableColumn[];

  const getSortDirection = (property: any) => {
    var config = sortConfig.find(
      (sortConfig) => sortConfig.propertyName === property
    );
    return config
      ? config.sortType === SortingType.Descending
        ? ">"
        : "<"
      : null;
  };

  return (
    <th>
      <tr>
        {tableColumn.map((column, index) => {
          return (
            <td
              key={index}
              className="headerCell"
              onClick={() =>
                sortBy(
                  column.property,
                  column.compareFunction as TableDataComparable
                )
              }
            >
              <span className="sortLabel">
                {column.label}
                {getSortDirection(column.property)}
              </span>
            </td>
          );
        })}
      </tr>
    </th>
  );
};

// paste from tut
// " {="" return(="" <tablecell="" key="{index}>" {data.label}="" <="" tablecell>="" )="" })}="" tablerow>="" tablehead>="" );=""
