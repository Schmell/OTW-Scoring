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
  SortingFnOption,
  SortingState,
  Table as ReactTable,
  useReactTable,
} from "@tanstack/react-table";

import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table as MyTable,
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
};

export default function ResultTable({ tableData }) {
  // Define the columns
  const columns = useMemo<ColumnDef<ResultRow>[]>(
    () => [
      {
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "boat",
            enableHiding: false,
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
            maxSize: 100,
          },
          {
            accessorKey: "fleet",
            enableHiding: false,
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "Results",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "points",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "elapsed",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "corrected",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "finish",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "Total",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "nett",
            enableHiding: false,
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );

  // this state is for the table data
  const [data, setData] = useState<ResultRow[]>([]);
  // set
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <Fragment>
      {data && columns && <Table data={data} columns={columns} />}
    </Fragment>
  );
}

function Table({
  data,
  columns,
}: {
  data: ResultRow[];
  columns: ColumnDef<ResultRow>[];
}) {
  //
  // States
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fleet", desc: true },
    { id: "corrected", desc: false },
  ]);
  const [resultType, setResultType] = useState("points");
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState({});

  // set up the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  useEffect(() => {
    const setVisbleColumns = () => {
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
    setVisbleColumns();
    const setSortingColumns = () => {
      console.log("sorting: ", sorting);
      console.log("resultType: ", resultType);
      const sortCols = [
        { id: "fleet", desc: false },
        { id: resultType, desc: false },
      ];
      setSorting(sortCols);
    };
    setSortingColumns();
  }, [resultType]);

  useEffect(() => {
    setResultType("corrected");
  }, []);

  return (
    <Fragment>
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
