import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import { FormGroup, Grid } from "@mui/material";
import classNames from "classnames";
import {
  FC,
  forwardRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import styled from "styled-components";

import "./flexTable.css";
import TableDrawer, { Item } from "./TableDrawer";

const Styles = styled.div`
  padding: 1rem;
  display: block;
  max-width: 800px;
  overflow: auto;

  .table {
    border-spacing: 0;
    border: 1px solid black;

    .thead {
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      border-bottom: 1px solid black;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-right: 1px solid black;

      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        touch-action: none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

// const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex",
    },
  },
];

interface indeterminateProps {
  [x: string | number | symbol]: unknown;
}

export const IndeterminateCheckbox: FC<indeterminateProps> = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      (
        resolvedRef as MutableRefObject<indeterminateProps>
      ).current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef as any} {...rest} />
      </>
    );
  }
);

function isEven(value: number) {
  if (value % 2 == 0) return true;
  else return false;
}

function FlexTable({ columns, data, resultType, setResultType }) {
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, allColumns } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        initialState: {
          sortBy: [
            {
              id: "comp.fleet",
              desc: false,
            },
          ],
          hiddenColumns: [
            "comp.rating",
            "comp.helmname",
            "comp.nett",
            "selection",
          ],
        },
        maxMultiSortColCount: 2,
      },

      useSortBy,
      useResizeColumns,
      useBlockLayout,
      useRowSelect,
      (hooks) => {
        hooks.allColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            disableResizing: true,
            minWidth: 30,
            width: 30,
            maxWidth: 30,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ]);
        hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
          // fix the parent group of the selection button to not be resizable
          const selectionGroupHeader = headerGroups[0].headers[0];
          selectionGroupHeader.canResize = false;
        });
      }
    );

  const [selectedRow, setSelectedRow] = useState();
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

      <div {...getTableProps()} className="table">
        <div className="headerRow">
          {headerGroups.map((headerGroup) => (
            <div className="tr" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div
                  className="th"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="headerBox">
                    {column.render("Header")}

                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ArrowDropDownRoundedIcon />
                      ) : (
                        <ArrowDropUpRoundedIcon />
                      )
                    ) : (
                      <div> </div>
                    )}
                  </div>

                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? "isResizing" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="tbody">
          {rows.map((row, idx) => {
            prepareRow(row);
            // console.log("row.index: ", row.index);
            let dataRowClass = classNames({
              tr: true,
              striped: isEven(idx),
            });
            return (
              <div
                {...row.getRowProps()}
                className={dataRowClass}
                onClick={(e: any) => {
                  // const row =  e.target.parentElement

                  e.target.parentElement.classList.toggle("selected");
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlexTable;
