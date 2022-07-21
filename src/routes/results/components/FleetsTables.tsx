import { Fragment, h } from "preact";
import { Divider } from "@chakra-ui/react";
import ResultTable from "./ResultTable";

export default function FleetsTable({ tableData, serInfo }) {
  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        return item.fleet || item.division;
      })
    )
  );
  // console.log("unique: ", unique);
  // console.log("tableData: ", tableData);
  unique.forEach((fleetName) => {
    const push = tableData.filter((td) => {
      if (td.fleet || td.division === fleetName) return td;
    });
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray.map((fleet) => (
        <Fragment>
          <ResultTable tableData={fleet} fleetName={fleet[0].fleet || fleet[0].division} serInfo={serInfo} />
          <Divider my={4} />
        </Fragment>
      ))}
    </Fragment>
  );
}
