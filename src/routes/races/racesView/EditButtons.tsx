import {
  Box,
  Flex,
  Icon,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { AreYouSure } from "../../../components/generic/AreYouSure";
// Icons
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "preact/hooks";
import useStorage from "../../../hooks/useStorage";

let _isMounted = false;
export default function EditButtons({ setRaceId, race }) {
  const deleteRaceDisclosure = useDisclosure();

  const [seriesId] = useStorage("seriesId");

  useEffect(() => {
    _isMounted = true;
    return () => (_isMounted = false);
  }, []);

  return (
    <Fragment>
      <Flex pb={2} align={"center"}>
        <Tooltip
          hasArrow
          label="Edit race settings"
          aria-label="Edit race settings"
          placement="top-start"
          bg="blue.300"
        >
          <IconButton
            aria-label="Edit race settings"
            variant={"ghost"}
            colorScheme="blue"
            icon={(<Icon as={EditIcon} boxSize={7} />) as any}
            onClick={() => {
              setRaceId(race.id);
              route("/races/edit");
            }}
          />
        </Tooltip>
        <Tooltip
          label="Delete Series"
          hasArrow
          bg="blue.300"
          placement="bottom-start"
        >
          <IconButton
            aria-label="Delete series"
            variant="ghost"
            colorScheme="blue"
            icon={(<Icon as={CloseIcon} boxSize={7} />) as any}
            onClick={deleteRaceDisclosure.onOpen}
          />
        </Tooltip>
      </Flex>
      <AreYouSure
        disclosure={deleteRaceDisclosure}
        colPath={`/series/${seriesId}/races`}
        itemId={race.id}
      >
        <Box>This will permanently delete the race and can not be un-done</Box>
        <Box>You will loose any work you have done with this race</Box>
        <Box>{race.id}</Box>
      </AreYouSure>
    </Fragment>
  );
}
