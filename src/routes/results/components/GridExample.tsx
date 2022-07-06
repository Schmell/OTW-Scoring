"use strict";
import { h } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { render } from "react-dom";
import { AgGridReact } from "@ag-grid-community/react";
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

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MenuModule,
  ColumnsToolPanelModule,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    {
      field: "date",
      minWidth: 180,
      menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    },
    {
      field: "sport",
      minWidth: 200,
      menuTabs: ["filterMenuTab", "columnsMenuTab"],
    },
    {
      field: "gold",
      menuTabs: ["generalMenuTab", "gibberishMenuTab"],
    },
    { field: "silver", menuTabs: [] },
    { field: "bronze" },
    { field: "total" },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const postProcessPopup = useCallback((params: PostProcessPopupParams) => {
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
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: any[]) => setRowData(data));
  }, []);

  const getMainMenuItems = useCallback(
    (params: GetMainMenuItemsParams): (string | MenuItemDef)[] => {
      // you don't need to switch, we switch below to just demonstrate some different options
      // you have on how to build up the menu to return
      switch (params.column.getId()) {
        // return the defaults, put add some extra items at the end
        case "athlete":
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
        case "age":
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
        case "country":
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
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          postProcessPopup={postProcessPopup}
          getMainMenuItems={getMainMenuItems}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector("#root"));
