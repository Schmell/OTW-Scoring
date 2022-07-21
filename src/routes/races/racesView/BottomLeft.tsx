import { Box, Flex, Icon, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { capitalizeFirstLetter } from "../../../util/formatters";
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { checkIfSailed } from "./checkIfRaceSailed";

export default function BottomLeft({ race, action }) {
  return (
    <Fragment>
      <LinkBox
        as={Flex}
        href="#"
        ml={2}
        alignItems={"center"}
        color={checkIfSailed({
          race,
          sailed: "green.500",
          unsailed: "blue.500",
          cancelled: "gray.500",
          postponed: "blue.500",
        })}
        onClick={() => {
          action(race);
        }}
      >
        <LinkOverlay as={Flex} href="#">
          <Box pr={1}>
            {checkIfSailed({
              race,
              sailed: <Icon as={CheckIcon} boxSize={4} />,
              unsailed: <Icon as={AddIcon} boxSize={4} />,
              cancelled: <Icon as={DoNotDisturbIcon} boxSize={4} />,
              postponed: <Icon as={CalendarIcon} boxSize={4} />,
            })}
          </Box>
          <Text>
            {checkIfSailed({
              race,
              sailed: "Sailed",
              unsailed: "Not Sailed",
              cancelled: capitalizeFirstLetter(race.data().sailed),
              postponed: capitalizeFirstLetter(race.data().sailed),
            })}
          </Text>
        </LinkOverlay>
      </LinkBox>
    </Fragment>
  );
}
