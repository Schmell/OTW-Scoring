import { Divider } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import ResultTable from "./ResultTable";

export default function FleetsTable({ tableData, serInfo }) {
  let fleetsArray: any = [];
  const unique = Array.from(new Set(tableData.map((item) => item.fleet)));
  unique.forEach((fleetName) => {
    const push = tableData.filter((td) => {
      if (td.fleet === fleetName) return td;
    });
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray.map((fleet) => (
        <Fragment>
          <ResultTable
            tableData={fleet}
            fleetName={fleet[0].fleet}
            serInfo={serInfo}
          />
          <Divider my={4} />
        </Fragment>
      ))}
    </Fragment>
  );
}
