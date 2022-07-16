import { Box, Button, Flex, Grid, GridItem, Icon, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { capitalizeFirstLetter } from "../../../util/formatters";
import { style } from "@mui/system";
import { route } from "preact-router";
// Icons
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TopLeft from "./TopLeft";
import EditButtons from "./EditButtons";
import BottomLeft from "./BottomLeft";
import BottomEnd from "./BottomEnd";

export default function RaceItem({ race, setRaceId }) {
  const rd = race.data();
  return (
    <Fragment>
      <Box
        borderRadius={5}
        borderWidth="1px"
        borderTopColor={"blue.200"}
        borderLeftColor={"blue.500"}
        shadow="md"
        my={3}
      >
        <Grid minH={8} templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={4} ml={2} mt={2}>
            <TopLeft race={race} />
          </GridItem>
          <GridItem colSpan={1} ml={2}>
            <Flex justifyContent={"end"}>
              <EditButtons setRaceId={setRaceId} race={race} />
            </Flex>
          </GridItem>
          <GridItem colSpan={2} ml={2}>
            <BottomLeft />
          </GridItem>
          <GridItem>
            <BottomEnd />
          </GridItem>
        </Grid>
      </Box>
    </Fragment>
  );
}
