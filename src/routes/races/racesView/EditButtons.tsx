import { Tooltip, IconButton, Icon } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";

// Icons
import EditIcon from "@mui/icons-material/Edit";

export default function EditButtons({ setRaceId, race }) {
  return (
    <Fragment>
      <Tooltip hasArrow label="Edit race settings" aria-label="Edit race settings" placement="top-start" bg="blue.300">
        <span>
          <IconButton
            aria-label="Edit race settings"
            variant={"ghost"}
            color={"gray.400"}
            icon={(<Icon as={EditIcon} />) as any}
            onClick={() => {
              setRaceId(race.id);
              route("/races/edit");
            }}
          />
        </span>
      </Tooltip>
    </Fragment>
  );
}
