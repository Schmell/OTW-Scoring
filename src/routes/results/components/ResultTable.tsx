// Chakra layout imports
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Icon,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
// Chakra hooks
import {
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Chakra table
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// Chakra form
import { Input, Select } from "@chakra-ui/react";

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
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import { useEffect, useMemo, useState } from "preact/hooks";
import SettingsModal from "./SettingsModal";

// Icons
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { DocumentData } from "firebase/firestore";
import ToolIconButton from "../../../components/generic/ToolIconButton";
import PageHead from "../../../components/page/pageHead";

type ResultRow = {
  id: number;
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

export default function ResultTable(props) {
  const { tableData, ...rest } = props;
  // this state is for the table data
  const [data, setData] = useState<ResultRow[]>([]);

  // set
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <Fragment>
      {data && (
        <Fragment>
          <FleetTable data={data} {...rest} />
        </Fragment>
      )}
    </Fragment>
  );
}

interface TableProps {
  data: ResultRow[];
  headerTitle: string;
  fleetName: string;
  serInfo: { event: string; resultType: string; rowTitle: string };
  racesArray: [];
  selectedRace: number;
  setSelectedRace: (arg0: number) => void;
  sailed: string;
  race: DocumentData | undefined;
  seriesId: string;
}

function FleetTable(props: TableProps) {
  const {
    data,
    serInfo,
    race,
    fleetName,
    racesArray,
    headerTitle,
    selectedRace,
    setSelectedRace,
    seriesId,
    ...rest
  } = props;
  // console.log("rest ", seriesId);
  // console.log("race: ", race);
  // States
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    boat: true,
    helmname: false,
    sailno: false,
    corrected: false,
    elapsed: false,
    finish: false,
    nett: true,
  });

  const tableSize = useBreakpointValue({
    base: "md",
    md: "sm",
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: false },
  ]);
  const [resultType, setResultType] = useState("points");
  const [columnPinning, setColumnPinning] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rowTitle, setRowTitle] = useState("boat");

  const [isSailed, setIsSailed] = useState("1");

  ////////////////////////////////////////////////////////
  // Define the columns
  const columns = useMemo<ColumnDef<ResultRow>[]>(
    () => [
      {
        accessorKey: "boat",
        id: "boat",
        enableHiding: true,
        cell: (info: any) => {
          return (
            <Link
              href={`/competitors/${info.row.original?._seriesid}/${info.row.original?.id}`}
            >
              {info.getValue()}
            </Link>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "helmname",
        id: "helmname",
        enableHiding: true,
        header: () => "Skipper",
        cell: (info: any) => {
          return (
            <Link
              href={`/competitors/${info.row.original?._seriesid}/${info.row.original?.id}`}
            >
              {info.getValue()}
            </Link>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sailno",
        id: "sailno",
        enableHiding: true,
        cell: (info: any) => {
          return (
            <Link
              href={`/competitors/${info.row.original?._seriesid}/${info.row.original?.id}`}
            >
              {info.getValue()}
            </Link>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "points",
        id: "points",
        enableHiding: false,
        header: () => <Flex justifyContent={"center"}>Points</Flex>,
        cell: (info: any) => (
          <Flex justifyContent={"center"}>
            {info.getValue() !== "" ? parseFloat(info.getValue()) : "---"}
          </Flex>
        ),
        footer: (props) => props.column.id,
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "elapsed",
        id: "elapsed",
        enableHiding: true,
        cell: (info: any) => (
          <Flex justify={"center"}>{parseFloat(info.getValue())}</Flex>
        ),
        footer: (props) => props.column.id,
        sortingFn: (rowA: any, rowB: any, columnId) => {
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
        cell: (info: any) => (
          <Flex justifyContent={"center"}>{info.getValue()}</Flex>
        ),
        footer: (props) => props.column.id,
        sortingFn: (rowA: any, rowB: any, columnId) => {
          if (rowA.getValue("corrected") === "---") return 1;
          if (rowB.getValue("corrected") === "---") return -1;
          if (rowA.getValue("corrected") < rowB.getValue("corrected"))
            return -1;
          if (rowA.getValue("corrected") > rowB.getValue("corrected")) return 1;
          return 0;
        },
      },
      {
        accessorKey: "finish",
        id: "finish",
        enableHiding: true,
        cell: (info: any) => (
          <Flex justify={"center"} m={0}>
            {info.getValue()}
          </Flex>
        ),
        footer: (props) => props.column.id,
        sortingFn: (rowA: any, rowB: any, columnId) => {
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
        header: () => <Flex justifyContent={"center"}>Nett</Flex>,
        cell: (info: any) => (
          <Flex justify={"center"} m={0}>
            {info.getValue()}
          </Flex>
        ),
        footer: (props) => props.column.id,
      },
    ],
    []
  ); //////////////////////////////////////////////////////

  // Set up the table
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

  // Set up visible columns and sorting columns
  useEffect(() => {
    const setVisibleColumns = () => {
      // need to
      table.getAllLeafColumns().forEach((column) => {
        // Clear current visible
        if (
          column.getIsVisible() &&
          column.id !== resultType &&
          column.id !== rowTitle
        ) {
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
        // Turn on nett with points
        if (column.id === "nett" && resultType === "points") {
          column.toggleVisibility(true);
        }
      });
    };
    setVisibleColumns();

    const setSortingColumns = () => {
      let sortCols = [{ id: resultType, desc: false }];
      // console.log("race?.sailed : ", race?.sailed);
      if (race?.sailed !== "1") {
        sortCols = [{ id: "nett", desc: false }];
      }
      setSorting(sortCols);
    };
    setSortingColumns();
    //
  }, [resultType, rowTitle, race]);

  const checkIfSailed = (sailed): any => {
    if (!sailed) return "";
    if (sailed === "1") return "Sailed";
    if (sailed === "cancelled") return "Cancelled";
    if (sailed === "postponed") return "Postponed";
    return "Un-Sailed";
  };
  // setIsSailed
  useEffect(() => {
    setIsSailed(checkIfSailed(race?.sailed));
  }, [race]);

  // Set the result type
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
      <Fragment>
        <PageHead title={fleetName ? fleetName : "Fleet"}>
          <ToolIconButton
            aria-label="Previous race"
            icon={ChevronLeftIcon}
            disabled={selectedRace <= 0}
            onClick={() => {
              setSelectedRace(selectedRace - 1);
            }}
          />
          <ToolIconButton
            aria-label="Next race"
            icon={ChevronRightIcon}
            disabled={selectedRace >= racesArray.length - 1}
            onClick={() => {
              setSelectedRace(selectedRace + 1);
            }}
          />
          <ToolIconButton
            aria-label="Edit Series"
            icon={EditIcon}
            onClick={() => route(`/series/edit/${seriesId}`)}
          />
          <ToolIconButton
            aria-label="Settings"
            icon={SettingsIcon}
            onClick={onOpen}
          />
        </PageHead>

        <SettingsModal
          isOpen={isOpen}
          onClose={onClose}
          rowTitle={rowTitle}
          setRowTitle={setRowTitle}
          setResultType={setResultType}
          resultType={resultType}
        />

        <Box p={2} mt={4}>
          <Heading
            fontSize={"xl"}
            py={3}
            pl={4}
            mb={1}
            color={useColorModeValue("gray.600", "blue.100")}
            borderTopRadius={16}
            bgGradient={useColorModeValue(
              "linear(to-r, whiteAlpha.100, blue.100)",
              "linear(to-r, whiteAlpha.100, blue.600)"
            )}
          >
            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                {race ? (
                  <Text fontSize="2xl">
                    {race?.name || `Race ${race?.rank}`}
                  </Text>
                ) : (
                  <Spinner size="xs" />
                )}
                {isSailed === undefined ||
                isSailed === "Sailed" ||
                isSailed === "" ? (
                  ""
                ) : (
                  <Text pl={1}>{`  - ${isSailed}`}</Text>
                )}
                <Box my={4}>{""}</Box>
              </Flex>
              <Text fontSize="sm" pr={4}>
                {race && race.date}
              </Text>
            </Flex>

            <Text fontSize="md">{serInfo.event}</Text>
          </Heading>

          <Table variant="striped" size={tableSize} colorScheme="blue">
            <Thead bgColor="blue.300">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="extrabold"
                        h={14}
                      >
                        {header.isPlaceholder ? null : (
                          <Flex
                            {...{
                              userSelect: "none",
                              cursor: header.column.getCanSort()
                                ? "pointer"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                            justifyContent={
                              header.id === "boat" ||
                              header.id === "helmname" ||
                              header.id === "sailno"
                                ? ""
                                : "center"
                            }
                            alignItems="center"
                          >
                            <Flex>
                              <Box>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </Box>
                              <Box>
                                {{
                                  asc: (
                                    <Icon as={ArrowUpwardIcon} boxSize={4} />
                                  ),
                                  desc: (
                                    <Icon as={ArrowDownwardIcon} boxSize={4} />
                                  ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </Box>
                            </Flex>
                          </Flex>
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
                    {row.getVisibleCells().map((cell: any) => {
                      return (
                        <Td key={cell.id}>
                          {cell.getContext().column.id !== "finish" &&
                          cell.getContext().column.id !== "elapsed" ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          ) : (
                            <Editable
                              defaultValue={cell.getValue() || null}
                              textAlign="center"
                            >
                              <EditablePreview />
                              <EditableInput type="time" />
                            </Editable>
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

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
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<<"}
                </Button>
                <Button
                  size={"xs"}
                  variant={"outline"}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </Button>
                <Button
                  size={"xs"}
                  variant={"outline"}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">"}
                </Button>
                <Button
                  size={"xs"}
                  variant={"outline"}
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
                  defaultValue={(
                    table.getState().pagination.pageIndex + 1
                  ).toString()}
                  onChange={(e: any) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                />
                Goto:
              </Box>
              <Select
                size={"xs"}
                borderRadius={"5px"}
                value={table.getState().pagination.pageSize}
                onChange={(e: any) => {
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

          <Box
            py={3}
            pl={4}
            mt={1}
            color={useColorModeValue("gray.600", "blue.100")}
            borderBottomRadius={16}
            bgGradient={useColorModeValue(
              "linear(to-l, whiteAlpha.100, blue.100)",
              "linear(to-l, whiteAlpha.100, blue.600)"
            )}
          >
            {table.getRowModel().rows.length} Competitors
          </Box>
          {/* <Box>{table.getState().pagination.pageSize} page size</Box> */}
        </Box>
      </Fragment>
    </Fragment>
  );
}
