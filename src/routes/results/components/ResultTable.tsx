import { Fragment, h } from "preact";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "preact/hooks";
// Icons
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SettingsIcon from "@mui/icons-material/Settings";

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
  sailno?: string;
};

export default function ResultTable({ tableData, fleetName, serInfo }) {
  // this state is for the table data
  const [data, setData] = useState<ResultRow[]>([]);

  // set
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return <Fragment>{data && <Table data={data} fleetName={fleetName} serInfo={serInfo} />}</Fragment>;
}

interface ITable {
  data: ResultRow[];
  fleetName: string;
  serInfo: { resultType: string; rowTitle: string };
}

function Table({ data, fleetName, serInfo }: ITable) {
  if (!fleetName) fleetName = "Fleet";
  // States
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    boat: true,
    helmname: false,
    sailno: false,
    corrected: false,
    elapsed: false,
    finish: false,
  });

  const [sorting, setSorting] = useState<SortingState>([{ id: "points", desc: false }]);
  const [resultType, setResultType] = useState("points");
  const [columnPinning, setColumnPinning] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rowTitle, setRowTitle] = useState("boat");

  ////////////////////////////////////////////////////////
  // Define the columns
  const columns = useMemo<ColumnDef<ResultRow>[]>(
    () => [
      {
        header: fleetName,
        columns: [
          {
            accessorKey: "boat",
            id: "boat",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "helmname",
            id: "helmname",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "sailno",
            id: "sailno",
            enableHiding: true,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "points",
            id: "points",
            enableHiding: false,
            cell: (props) => parseFloat(props.getValue()),
            footer: (props) => props.column.id,
            sortingFn: "alphanumeric",
          },
          {
            accessorKey: "elapsed",
            id: "elapsed",
            enableHiding: true,
            footer: (props) => props.column.id,
            sortingFn: (rowA, rowB, columnId) => {
              if (rowA.getValue("elapsed") === "---") return 1;
              if (rowB.getValue("elapsed") === "---") return -1;
              if (rowA.getValue("elapsed") < rowB.getValue("elapsed")) return -1;
              if (rowA.getValue("elapsed") > rowB.getValue("elapsed")) return 1;
              return 0;
            },
          },
          {
            accessorKey: "corrected",
            id: "corrected",
            enableHiding: true,
            footer: (props) => props.column.id,
            sortingFn: (rowA, rowB, columnId) => {
              if (rowA.getValue("corrected") === "---") return 1;
              if (rowB.getValue("corrected") === "---") return -1;
              if (rowA.getValue("corrected") < rowB.getValue("corrected")) return -1;
              if (rowA.getValue("corrected") > rowB.getValue("corrected")) return 1;
              return 0;
            },
          },
          {
            accessorKey: "finish",
            id: "finish",
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
            id: "nett",
            enableHiding: true,
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

  // this useEffect is to set up visible columns and sorting columns
  useEffect(() => {
    const setVisibleColumns = () => {
      // need to
      table.getAllLeafColumns().forEach((column) => {
        // Clear current visible
        if (column.getIsVisible() && column.id !== resultType && column.id !== rowTitle) {
          column.toggleVisibility();
        }

        // Turn on column from result type
        if (column.id === resultType) {
          column.toggleVisibility();
        }

        // Turn on column from row title
        if (!column.getIsVisible() && column.id === rowTitle) {
          column.toggleVisibility();
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
  }, [resultType, rowTitle]);

  // set the result type
  useEffect(() => {
    if (!serInfo.resultType) {
      setResultType("points");
    } else {
      setResultType(serInfo.resultType);
    }
    if (!serInfo.rowTitle) {
      setRowTitle("boat");
    } else {
      setRowTitle(serInfo.rowTitle);
    }
  }, []);

  return (
    <Fragment>
      <Flex justifyContent={"space-between"}>
        <Heading>{fleetName}</Heading>
        <Box>
          <IconButton
            aria-label="settings"
            icon={(<Icon as={SettingsIcon} />) as any} // not sure why??
            size="md"
            colorScheme={"blue"}
            variant={"ghost"}
            onClick={onOpen}
          />
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Heading size={"sm"} pb={3}>
                View Columns
              </Heading>
              <RadioGroup onChange={setRowTitle} value={rowTitle}>
                <Stack direction="row">
                  <Radio value="boat">Boat</Radio>
                  <Radio value="helmname">Helm</Radio>
                  <Radio value="sailno">SailNo.</Radio>
                </Stack>
              </RadioGroup>
              <Divider my={3} />
              <RadioGroup onChange={setResultType} value={resultType}>
                <Stack direction="row">
                  <Radio value="points">Points</Radio>
                  <Radio value="elapsed">Elapsed</Radio>
                  <Radio value="corrected">Corrected</Radio>
                  <Radio value="finish">Finish</Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>

      <Divider my={3} />

      <Box>
        <MyTable>
          <Thead bgColor="blue.300">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} colSpan={header.colSpan} color={"gray.800"}>
                      {header.isPlaceholder ? null : (
                        <Box
                          {...{
                            userSelect: "none",
                            cursor: header.column.getCanSort() ? "pointer" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <Flex>
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            <Box ml={2}>
                              {" "}
                              {{
                                asc: <Icon as={ArrowUpwardIcon} boxSize={4} />,
                                desc: <Icon as={ArrowDownwardIcon} boxSize={4} />,
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
                    return <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>;
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </MyTable>

        <Box className="h-2" />

        {/* This is the pagination navigation */}
        {table.getRowModel().rows.length > table.getState().pagination.pageSize && (
          <Flex alignItems={"start"} justifyContent={"space-evenly"} gap={1} py={3}>
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
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
