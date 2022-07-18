import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Fragment, h } from "preact";
//Icons
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { capitalizeFirstLetter } from "../../../util/formatters";

export default function TopLeft({ race, action }) {
  return (
    <Fragment>
      <Flex
        alignItems={"center"}
        color="gray.500"
        onClick={() => {
          action(race);
        }}
      >
        <Text px={3} fontSize={22} fontWeight={"semibold"} color="gray.600">
          {race.data().name ? race.data().name : `Race ${race.data().rank}`}
        </Text>
      </Flex>
    </Fragment>
  );
}
