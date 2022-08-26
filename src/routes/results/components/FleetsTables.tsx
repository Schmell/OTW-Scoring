import { Fragment, h } from "preact";
import { Divider, Text } from "@chakra-ui/react";
import ResultTable from "./ResultTable";
import { useEffect } from "preact/hooks";

export default function FleetsTable(props) {
  const { tableData, raceName, ...rest } = props;

  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        if (item.fleet && item.division) {
          return `${item.fleet} - ${item.division}`;
        }
        if (item.division) return item.division;

        return item.fleet;
      })
    )
  );

  unique.forEach((fleetName) => {
    const push = tableData.filter((td) => {
      if (td.fleet && td.fleet === fleetName) return td;
      if (td.division && td.division === fleetName) {
        td.fleet = td.division;
        return td;
      }
    });
    fleetsArray.push(push);
  });

  useEffect(() => {
    console.log("raceName: ", raceName);
  }, [tableData]);

  return (
    <Fragment>
      {fleetsArray &&
        fleetsArray.sort().map((fleet) => {
          return (
            <Fragment>
              <ResultTable tableData={fleet} fleetName={fleet[0].fleet} raceName={raceName} {...rest} />
              <Divider mb={4} mt={8} />
            </Fragment>
          );
        })}
    </Fragment>
  );
}
