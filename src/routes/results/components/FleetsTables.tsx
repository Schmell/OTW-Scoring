import { Fragment, h } from "preact";
import { Divider, Text } from "@chakra-ui/react";
import ResultTable from "./ResultTable";

export default function FleetsTable({ tableData, serInfo, raceId, raceName }) {
  console.log("serInfo: ", serInfo.event);
  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        return item.fleet || item.division;
      })
    )
  );

  unique.forEach((fleetName) => {
    const push = tableData.filter((td) => {
      if (td.fleet || td.division === fleetName) return td;
    });
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray.sort().map((fleet) => (
        <Fragment>
          <ResultTable
            tableData={fleet}
            fleetName={fleet[0].fleet || fleet[0].division}
            serInfo={serInfo}
            raceId={raceId}
            raceName={raceName}
          />
          <Divider my={4} />
        </Fragment>
      ))}
    </Fragment>
  );
}
