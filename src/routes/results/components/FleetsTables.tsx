import { Fragment, h } from "preact";
import { Divider, Text } from "@chakra-ui/react";
import ResultTable from "./ResultTable";

export default function FleetsTable({ tableData, serInfo, raceId, raceName }) {
  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        return item.fleet || item.division;
      })
    )
  );
  // console.log("unique: ", unique);

  unique.forEach((fleetName) => {
    const push = tableData.filter((td) => {
      if (td.fleet && td.fleet === fleetName) return td;
      if (td.division && td.division === fleetName) {
        td.fleet = td.division;
        return td;
      }
    });
    console.log("push: ", push);
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray &&
        fleetsArray.sort().map((fleet) => {
          console.log("fleet: ", fleetsArray);
          return (
            <Fragment>
              <ResultTable
                tableData={fleet}
                fleetName={fleet[0].fleet}
                serInfo={serInfo}
                raceId={raceId}
                raceName={raceName}
              />
              <Divider my={4} />
            </Fragment>
          );
        })}
    </Fragment>
  );
}
