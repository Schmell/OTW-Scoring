import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "preact/hooks";
import { h } from "preact";
// import { render } from 'react-dom';

import { AgGridReact } from "@ag-grid-community/react"; // the AG Grid React Component
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS

import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import {
  ColDef,
  ColGroupDef,
  GetMainMenuItems,
  GetMainMenuItemsParams,
  Grid,
  GridOptions,
  GridReadyEvent,
  MenuItemDef,
  PostProcessPopupParams,
} from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { SideBarDef } from "ag-grid-community";

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MenuModule,
  ColumnsToolPanelModule,
]);

const AG_ResultTable = ({ data }) => {
  const gridRef = useRef<any>(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "boat",
      minWidth: 120,
      maxWidth: 130,
      pinned: "left",
      lockPinned: true,
    },

    // I would rather make a different table for each fleet
    // {
    //   field: "fleet",
    //   minWidth: 100,
    //   maxWidth: 120,
    //   pinned: "left",
    //   lockPinned: true,
    // },
    {
      field: "helmname",
      headerName: "Helm",
      //   width: 130,
      flex: 200,
      minWidth: 130,
      //   pinned: "left",
      lockPinned: false,
      menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    },
    {
      field: "points",
      menuTabs: ["columnsMenuTab"],
    },
    {
      field: "elapsed",
      menuTabs: ["columnsMenuTab"],
    },
    {
      field: "corrected",
      menuTabs: ["columnsMenuTab"],
    },
    {
      field: "finish",
      menuTabs: ["columnsMenuTab"],
    },
    { field: "nett", maxWidth: 90, pinned: "right", lockPinned: true },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      minWidth: 60,
      maxWidth: 90,
      resizable: true,
      editable: true,
      filter: true,
    }),
    []
  );

  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      defaultToolPanel: "columns",
      hiddenByDefault: true,
    };
  }, []);

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from sever
  //   useEffect(() => {
  //     fetch("https://www.ag-grid.com/example-assets/row-data.json")
  //       .then((result) => result.json())
  //       .then((rowData) => setRowData(rowData));
  //   }, []);

  useEffect(() => {
    setRowData(data);
  }, [rowData]);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    if (gridRef && gridRef.current) {
      gridRef.current.api.deselectAll();
    }
  }, []);

  const postProcessPopup = useCallback((params: any) => {
    // check callback is for menu
    if (params.type !== "columnMenu") {
      return;
    }
    const columnId = params.column ? params.column.getId() : undefined;
    if (columnId === "gold") {
      const ePopup = params.ePopup;
      let oldTopStr = ePopup.style.top!;
      // remove 'px' from the string (AG Grid uses px positioning)
      oldTopStr = oldTopStr.substring(0, oldTopStr.indexOf("px"));
      const oldTop = parseInt(oldTopStr);
      const newTop = oldTop + 25;
      ePopup.style.top = newTop + "px";
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setRowData(data);
  }, []);

  const getMainMenuItems = useCallback(
    (params: GetMainMenuItemsParams): (string | MenuItemDef)[] => {
      // you don't need to switch, we switch below to just demonstrate some different options
      // you have on how to build up the menu to return
      console.log("params.column.getId(): ", params.column.getId());
      switch (params.column.getId()) {
        // return the defaults, put add some extra items at the end
        case "points":
          const athleteMenuItems: (MenuItemDef | string)[] =
            params.defaultItems.slice(0);
          athleteMenuItems.push({
            name: "AG Grid Is Great",
            action: () => {
              console.log("AG Grid is great was selected");
            },
          });
          athleteMenuItems.push({
            name: "Casio Watch",
            action: () => {
              console.log("People who wear casio watches are cool");
            },
          });
          athleteMenuItems.push({
            name: "Custom Sub Menu",
            subMenu: [
              {
                name: "Black",
                action: () => {
                  console.log("Black was pressed");
                },
              },
              {
                name: "White",
                action: () => {
                  console.log("White was pressed");
                },
              },
              {
                name: "Grey",
                action: () => {
                  console.log("Grey was pressed");
                },
              },
            ],
          });
          return athleteMenuItems;
        // return some dummy items
        case "elapsed":
          return [
            {
              // our own item with an icon
              name: "Joe Abercrombie",
              action: () => {
                console.log("He wrote a book");
              },
              icon: '<img src="https://www.ag-grid.com/example-assets/lab.png" style="width: 14px;" />',
            },
            {
              // our own icon with a check box
              name: "Larsson",
              action: () => {
                console.log("He also wrote a book");
              },
              checked: true,
            },
            "resetColumns", // a built in item
          ];
        // return all the default items, but remove app separators and the two sub menus
        case "corrected":
          const countryMenuItems: (MenuItemDef | string)[] = [];
          const itemsToExclude = ["separator", "pinSubMenu", "valueAggSubMenu"];
          params.defaultItems.forEach((item) => {
            if (itemsToExclude.indexOf(item) < 0) {
              countryMenuItems.push(item);
            }
          });
          return countryMenuItems;
        default:
          // make no changes, just accept the defaults
          return params.defaultItems;
      }
    },
    []
  );

  return (
    <div>
      {/* Example using Grid's API */}
      {/* <button onClick={buttonListener}>Push Me</button> */}

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 600 }}>
        <AgGridReact
          rowData={data} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          //   postProcessPopup={postProcessPopup}
          //   getMainMenuItems={getMainMenuItems}
        />
      </div>
    </div>
  );
};

export default AG_ResultTable;
