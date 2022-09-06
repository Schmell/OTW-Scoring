import { Fragment, h } from "preact";
import { Divider } from "@chakra-ui/react";
import ResultTable from "./ResultTable";

export default function FleetsTable(props) {
  const { tableData, ...rest } = props;

  let fleetsArray: any = [];
  const unique = Array.from(
    new Set(
      tableData.map((item) => {
        // Still have to work out how to deal with
        // races with Fleets and division. ie: NFS div1
        if (item.division) return item.division;

        return item.fleet;
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
      // return Fleet if there is no fleet defined
      if (!td.fleet || td.division) return "Fleet";
    });

    fleetsArray.push(push);
  });

  return (
    <Fragment>
      {fleetsArray &&
        fleetsArray.sort().map((fleet) => {
          console.log("fleet: ", fleet);
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
