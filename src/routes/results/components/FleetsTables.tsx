import { Box } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import ResultTable from "./ResultTable";

export default function FleetsTable(props) {
  const { tableData, ...rest } = props;

  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        if (!item.fleet || item.fleet === undefined) {
          if (item.division) return item.division;
          return "Fleet";
        }

        return item.fleet;
      })
    )
  );

  unique.forEach((fleetName) => {
    const push = tableData.filter((row) => {
      if (!row.fleet && !row.division) return row;
      if (row.fleet && row.fleet === fleetName) return row;
      if (row.division && row.division === fleetName) {
        row.fleet = row.division;
        return row;
      }
    });
    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray &&
        fleetsArray.sort().map((fleet) => {
          return (
            <Box mb={14}>
              <ResultTable
                tableData={fleet}
                fleetName={fleet[0].fleet}
                {...rest}
              />
              {/* <Divider mb={4} mt={8} /> */}
            </Box>
          );
        })}
    </Fragment>
  );
}
