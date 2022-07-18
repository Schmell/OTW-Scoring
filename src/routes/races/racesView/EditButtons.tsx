import { Box, Flex, Icon, IconButton, Tooltip, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { AreYouSure } from "../../../components/generic/AreYouSure";
// Icons
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export default function EditButtons({ setRaceId, race }) {
  const deleteRaceDisclosure = useDisclosure();
  return (
    <Fragment>
      <Flex pb={2} align={"center"} color={useColorModeValue("blue.400", "whiteAlpha.400")}>
        <Tooltip
          hasArrow
          label="Edit race settings"
          aria-label="Edit race settings"
          placement="top-start"
          bg="blue.300"
        >
          <span>
            <IconButton
              aria-label="Edit race settings"
              variant={"ghost"}
              icon={(<Icon as={EditIcon} />) as any}
              onClick={() => {
                setRaceId(race.id);
                route("/races/edit");
              }}
            />
          </span>
        </Tooltip>
        <Tooltip label="Delete Series" hasArrow bg="blue.300" placement="bottom-start">
          <IconButton
            aria-label="Delete series"
            icon={(<Icon as={CloseIcon} />) as any}
            variant="ghost"
            onClick={deleteRaceDisclosure.onOpen}
          />
        </Tooltip>
      </Flex>
      <AreYouSure disclosure={deleteRaceDisclosure} colPath="races" itemId={race.id}>
        <Box>This will delete the race and is not undo-able</Box>
        <Box>You will loose any work you have done with this Race</Box>
      </AreYouSure>
    </Fragment>
  );
}
