import { FormGroup, Grid } from "@mui/material";
import { FC } from "react";
import { useSortBy, useTable } from "react-table";
import { Props } from "../SeriesTable";
import TableDrawer, { Item } from "./TableDrawer";

export const MyTable: FC<Props> = ({
  columns,
  data,
  resultType,
  setResultType,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    allColumns,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "comp.fleet",
            desc: false,
          },
          // {
          //   id: "comp.rank",
          //   desc: false,
          // },
        ],
        hiddenColumns: ["comp.rating", "comp.helmname", "comp.nett"],
      },
      maxMultiSortColCount: 2,
      className: "-striped -highlight",
    },
    useSortBy
  );

  return (
    <div className="tableContainer">
      <TableDrawer>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Item>
              {allColumns.map((column) => (
                <div key={column.id}>
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                    {column.render("Header")}
                  </label>
                </div>
              ))}
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <FormGroup>
                <label>
                  <input
                    type="radio"
                    name="resultType"
                    onChange={() => {
                      setResultType?.("points");
                    }}
                  />
                  Points
                </label>
                <label>
                  <input
                    type="radio"
                    name="resultType"
                    onChange={() => {
                      setResultType?.("corrected");
                    }}
                  />
                  Corrected
                </label>
                <label>
                  <input
                    type="radio"
                    name="resultType"
                    onChange={() => {
                      setResultType?.("elapsed");
                    }}
                  />
                  Elapsed
                </label>
                <label>
                  <input
                    type="radio"
                    name="resultType"
                    onChange={() => {
                      setResultType?.("finish");
                    }}
                  />
                  Finish
                </label>
              </FormGroup>
            </Item>
          </Grid>
        </Grid>
      </TableDrawer>

      <table {...getTableProps()} className="resultsTable">
        <thead className={"headerRow"}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div className={"headerCol"}>
                    <div>{column.render("Header")}</div>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />
                    {/* Add a sort direction indicator */}
                    <span style={{ width: "25px" }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const TableOptions = () => {
  return <></>;
};
