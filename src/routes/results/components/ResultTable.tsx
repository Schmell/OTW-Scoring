import { Fragment, h } from "preact";

import "./index.css";

import {
  Column,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingFnOption,
  SortingState,
  Table as ReactTable,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table as MyTable,
  TagRightIcon,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "preact/hooks";
import { MdOutlineArrowDownward, MdOutlineArrowUpward } from "react-icons/md";

type ResultRow = {
  boat: string;
  helmname: string;
  fleet: string;
  points: string;
  finish: string;
  start: string;
  elapsed: string;
  corrected: string;
  nett: string;
  total: string;
  // serInfo: [{}];
};

export default function ResultTable({ tableData, fleetName, serInfo }) {
  // this state is for the table data
  const [data, setData] = useState<ResultRow[]>([]);

  console.log("serInfo: ", serInfo);

  // set
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <Fragment>
      {data && <Table data={data} fleetName={fleetName} serInfo={serInfo} />}
    </Fragment>
  );
}

function Table({
  data,
  fleetName,
  serInfo,
}: {
  data: ResultRow[];
  fleetName: string;
  serInfo: { resultType: string };
}) {
  // States
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    // boat: true,
    // points: true,
    // corrected: true,
    elapsed: false,
    finish: false,
    // nett: true,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: false },
  ]);
  const [resultType, setResultType] = useState("points");
  const [columnPinning, setColumnPinning] = useState({});

  ////////////////////////////////////////////////////////
  // Define the columns
  const columns = useMemo<ColumnDef<ResultRow>[]>(
    () => [
      {
        header: fleetName,
        columns: [
          {
            accessorKey: "boat",
            enableHiding: false,
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
            maxSize: 100,
          },
          {
            accessorKey: "points",
            enableHiding: false,
            cell: (props) => parseFloat(props.getValue()),
            footer: (props) => props.column.id,
            sortingFn: "alphanumeric",
          },
          {
            accessorKey: "elapsed",
            enableHiding: true,
            footer: (props) => props.column.id,
            sortingFn: (rowA, rowB, columnId) => {
              if (rowA.getValue("elapsed") === "---") return 1;
              if (rowB.getValue("elapsed") === "---") return -1;
              if (rowA.getValue("elapsed") < rowB.getValue("elapsed"))
                return -1;
              if (rowA.getValue("elapsed") > rowB.getValue("elapsed")) return 1;
              return 0;
            },
          },
          {
            accessorKey: "corrected",
            enableHiding: true,
            footer: (props) => props.column.id,
            sortingFn: (rowA, rowB, columnId) => {
              if (rowA.getValue("corrected") === "---") return 1;
              if (rowB.getValue("corrected") === "---") return -1;
              if (rowA.getValue("corrected") < rowB.getValue("corrected"))
                return -1;
              if (rowA.getValue("corrected") > rowB.getValue("corrected"))
                return 1;
              return 0;
            },
          },
          {
            accessorKey: "finish",
            enableHiding: true,
            footer: (props) => props.column.id,
            sortingFn: (rowA, rowB, columnId) => {
              if (rowA.getValue("finish") === "---") return 1;
              if (rowB.getValue("finish") === "---") return -1;
              if (rowA.getValue("finish") < rowB.getValue("finish")) return -1;
              if (rowA.getValue("finish") > rowB.getValue("finish")) return 1;
              return 0;
            },
          },
          {
            accessorKey: "nett",
            enableHiding: false,
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  ); //////////////////////////////////////////////////////

  // set up the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnPinning,
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const setVisibleColumns = () => {
      table.getAllLeafColumns().forEach((column) => {
        if (column.getCanHide()) {
          if (column.getIsVisible() && column.id !== resultType) {
            column.toggleVisibility();
          }

          if (column.id === resultType) {
            column.toggleVisibility();
          }
        }
      });
    };
    setVisibleColumns();

    const setSortingColumns = () => {
      const sortCols = [{ id: resultType, desc: false }];
      setSorting(sortCols);
    };
    setSortingColumns();
    //
  }, [resultType]);

  useEffect(() => {
    if (!serInfo.resultType) {
      setResultType("points");
    } else {
      setResultType(serInfo.resultType);
    }
  }, []);

  return (
    <Fragment>
      <Heading>{fleetName}</Heading>
      <Divider my={2} />
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <RadioGroup onChange={setResultType} value={resultType}>
          <Stack direction="row">
            <Radio value="points">Points</Radio>
            <Radio value="elapsed">Elapsed</Radio>
            <Radio value="corrected">Corrected</Radio>
            <Radio value="finish">Finish</Radio>
          </Stack>
        </RadioGroup>

        <Box pr={2} color={"gray.300"}>
          {table.getRowModel().rows.length} Rows
        </Box>
      </Flex>

      <Divider my={3} />

      <Box>
        <MyTable>
          {}
          <Thead bgColor="blue.300">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      color={"gray.800"}
                    >
                      {header.isPlaceholder ? null : (
                        <Box
                          {...{
                            userSelect: "none",
                            cursor: header.column.getCanSort() ? "pointer" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <Flex>
                            <Box>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Box>
                            <Box>
                              {" "}
                              {{
                                asc: <Icon as={MdOutlineArrowUpward} />,
                                desc: <Icon as={MdOutlineArrowDownward} />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </Box>
                          </Flex>
                        </Box>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </MyTable>

        <Box className="h-2" />

        {/* This is the pagination navigation */}
        {table.getRowModel().rows.length >
          table.getState().pagination.pageSize && (
          <Flex
            alignItems={"start"}
            justifyContent={"space-evenly"}
            gap={1}
            py={3}
          >
            <Flex alignItems={"center"} gap={1} mr={3}>
              <Button
                size={"xs"}
                variant={"outline"}
                colorScheme={"blue"}
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                size={"xs"}
                variant={"outline"}
                colorScheme={"blue"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                size={"xs"}
                variant={"outline"}
                colorScheme={"blue"}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                size={"xs"}
                variant={"outline"}
                colorScheme={"blue"}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </Flex>

            <Flex alignItems={"center"} gap={1}>
              <Box>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </Box>
            </Flex>
            <Box>
              <Input
                type="number"
                size={"xs"}
                borderRadius={"5px"}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
              Goto:
            </Box>
            <Select
              size={"xs"}
              borderRadius={"5px"}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        )}

        <Box mr={"auto"}>{table.getRowModel().rows.length} Rows</Box>
        {/* <Box>{table.getState().pagination.pageSize} page size</Box> */}
      </Box>
    </Fragment>
  );
}
