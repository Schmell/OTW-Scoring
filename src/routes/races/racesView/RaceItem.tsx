import { Box, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import useStorage from "../../../hooks/useStorage";
import BottomEnd from "./BottomEnd";
// Icons
import BottomLeft from "./BottomLeft";
import { checkIfSailed } from "./checkIfRaceSailed";
import EditButtons from "./EditButtons";
import StartTheRaceModal from "./StartTheRaceModal";
import TopLeft from "./TopLeft";
interface RaceItemProps {
  race: QueryDocumentSnapshot<DocumentData>;
  setRaceId: string;
  key: string;
  raceId?: string;
}

export default function RaceItem({ race, raceId, setRaceId }: RaceItemProps) {
  //
  const [seriesId] = useStorage("serieId");
  const startTheRaceDisclosure = useDisclosure();

  const handleOnClick = (race) => {
    if (race.data().sailed === "1") route(`/result/${race.data()._seriesid}/${race.data().raceid}`);
    if (race.data().sailed === "0") startTheRaceDisclosure.onOpen();
    if (race.data().sailed === "postponed") startTheRaceDisclosure.onOpen();
  };

  return (
    <Fragment>
      <Box
        key={race.id}
        borderRightRadius={18}
        borderBottomWidth={4}
        borderColor={checkIfSailed({
          race,
          sailed: "green.500",
          unsailed: "blue.500",
          postponed: "blue.500",
        })}
        shadow="md"
        my={4}
      >
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={4} ml={2} mt={1}>
            <TopLeft race={race} action={handleOnClick} />
          </GridItem>
          <GridItem colSpan={1} ml={2}>
            <Flex justifyContent={"end"}>
              <EditButtons setRaceId={setRaceId} race={race} />
            </Flex>
          </GridItem>
          <GridItem colSpan={2} ml={2}>
            <BottomLeft race={race} />
          </GridItem>
          <GridItem colSpan={3}>
            <BottomEnd race={race} />
          </GridItem>
        </Grid>
      </Box>
      <StartTheRaceModal race={race} disclosure={startTheRaceDisclosure} />
    </Fragment>
  );
}
