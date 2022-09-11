import { Fragment, h } from "preact";
import { Divider, Text } from "@chakra-ui/react";
import ResultTable from "./ResultTable";
import { useEffect } from "preact/hooks";

export default function FleetsTable(props) {
  const { tableData, ...rest } = props;

  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        // if (item.fleet && item.division) {
        //   return `${item.fleet} - ${item.division}`;
        // }
        // console.log("item: ", item);
        if (!item.fleet) {
          return "Fleet";
        }
        if (item.division) return item.division;

        return item.fleet;
      })
    )
  );

  unique.forEach((fleetName) => {
    // console.log("fleetName: ", fleetName);
    const push = tableData.filter((td) => {
      if (!td.fleet && !td.division) return td;
      if (td.fleet && td.fleet === fleetName) return td;
      if (td.division && td.division === fleetName) {
        td.fleet = td.division;
        return td;
      }
    });
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray &&
        fleetsArray.sort().map((fleet) => {
          return (
            <Fragment>
              <ResultTable
                tableData={fleet}
                fleetName={fleet[0].fleet}
                {...rest}
              />
              <Divider mb={4} mt={8} />
            </Fragment>
          );
        })}
    </Fragment>
  );
}
