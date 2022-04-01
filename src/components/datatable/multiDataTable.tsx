import { Fragment, h } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { fetchData, TableData } from "./fetchData";
import "./dataTable.css";

export interface SortingConfiguration {
  propertyName: keyof TableData;
  sortType: SortingType;
  compareFunction?: TableDataComparable;
}

export enum SortingType {
  Ascending,
  Descending,
}

export type TableDataComparable = (a: TableData, b: TableData) => number;

export const TableExample = () => {
  const dataList = fetchData();
  const [sortConfig, updateSortConfig] = useState<SortingConfiguration[]>([]);
  //Below is an example of sorting columns by name by default.
  const [initializedSortConfig, updateInitSortConfig] = useState<
    SortingConfiguration[]
  >([{ propertyName: "name", sortType: SortingType.Descending }]);

  const sortBy = useCallback(
    (propertyName: any, compareFunction: TableDataComparable) => {
      let pendingChange = [...sortConfig];
      const index = pendingChange.findIndex(
        (config) => config.propertyName === propertyName
      );
      if (index > -1) {
        //Save the sortType
        var currentSortType = pendingChange[index].sortType;
        //Remove existing config
        pendingChange.splice(index, 1);
        //check if the sort type we saved is descending
        if (currentSortType === SortingType.Descending) {
          pendingChange = [
            ...pendingChange,
            {
              propertyName: propertyName,
              sortType: SortingType.Ascending,
              compareFunction: compareFunction,
            },
          ];
        }
      } else {
        pendingChange = [
          ...pendingChange,
          {
            propertyName: propertyName,
            sortType: SortingType.Descending,
            compareFunction: compareFunction,
          },
        ];
      }
      updateSortConfig([...pendingChange]);
    },
    [sortConfig]
  );

  const sortedRows = useMemo(() => {
    if (sortConfig.length === 0) {
      return [...dataList];
    }
    let sorted = [...dataList].sort((a: TableData, b: TableData) => {
      for (const config of sortConfig) {
        const result = config.compareFunction!(a, b); // bang
        if (result !== 0) {
          if (config.sortType === SortingType.Ascending) {
            return result;
          } else {
            return -result;
          }
        }
      }
      return 0;
    });
    return sorted;
  }, [sortConfig, dataList]);

  return (
    <div>
      <table>
        <SortableHeader sortBy={sortBy} sortConfig={sortConfig} />

        {sortedRows.map((data: any) => {
          return (
            <tr>
              <td>
                <span>{data.name}</span>
              </td>
              <td>
                <span>{data.hours}</span>
              </td>
              <td>
                <span>{data.startDate.toDateString()}</span>
              </td>
              <td>
                <span>{data.department}</span>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export interface SortableHeaderProps {
  sortBy: (string: any, compareFunction: TableDataComparable) => void;
  sortConfig: SortingConfiguration[];
}

export interface TableColumn {
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
  );
};
