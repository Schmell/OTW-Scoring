import { Flex, Icon, Button, Text } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { capitalizeFirstLetter } from "../../../util/formatters";
//Icons
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function TopLeft({ race }) {
  return (
    <Fragment>
      <Flex alignItems={"center"}>
        {/* Icon for row */}
        {race.data().sailed === "1" ? (
          <Icon as={CheckIcon} color="gray.500" />
        ) : race.data().sailed === "cancelled" ? (
          <Icon as={DoNotDisturbIcon} color="red.900" />
        ) : race.data().sailed === "postponed" ? (
          <Icon as={CalendarIcon} color="gray.400" />
        ) : (
          <Icon as={AddIcon} color="green.400" />
        )}
        {/* If Name else R+N */}
        <Text px={3} fontSize={22} fontWeight={"semibold"}>
          {race.data().name ? race.data().name : `Race ${race.data().rank}`}
        </Text>
        <Text color="gray.400" px={3} fontSize="xs">
          {/* Change the sailwave number to sailed or not and  */}
          {race.data().sailed === "1" ? (
            " - Sailed"
          ) : race.data().sailed === "0" ? (
            <Button
              aria-label="Start Race"
              colorScheme="green"
              // className={style.startRaceButton}
              size="xs"
              rightIcon={(<Icon as={ChevronRightIcon} />) as any}
            >
              Start race
            </Button>
          ) : (
            capitalizeFirstLetter(race.data().sailed)
          )}
        </Text>
      </Flex>
    </Fragment>
  );
}
