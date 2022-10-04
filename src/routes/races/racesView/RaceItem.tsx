import { Fragment, h } from "preact";
import { route } from "preact-router";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import BottomEnd from "./BottomEnd";
import BottomLeft from "./BottomLeft";
import EditButtons from "./EditButtons";
import StartTheRaceModal from "./StartTheRaceModal";
import TopLeft from "./TopLeft";
import { checkIfSailed } from "./checkIfRaceSailed";

interface RaceItemProps {
  race: QueryDocumentSnapshot<DocumentData>;
  setRaceId: string;
  key: string;
}

export default function RaceItem({ race, setRaceId }: RaceItemProps) {
  //
  const startTheRaceDisclosure = useDisclosure();

  const handleOnClick = (race) => {
    // if no name use rank
    const raceName = race.data().name
      ? race.data().name
      : `Race ${race.data().rank}`;
    // Open results if sailed else open start race modal
    if (race.data().sailed === "1")
      route(
        `/result/${race.data()._seriesid}/${race.data().raceid}/${raceName}`
      );
    if (race.data().sailed === "0") startTheRaceDisclosure.onOpen();
    if (race.data().sailed === "postponed") startTheRaceDisclosure.onOpen();
  };

  return (
    <Fragment>
      <Box
        key={race.id}
        m={4}
        borderWidth={1}
        shadow="md"
        bgColor={useColorModeValue("white", "blackAlpha.300")}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        borderBottomRightRadius="2em"
        borderTopLeftRadius={18}
        borderBottomWidth={4}
        borderBottomColor={checkIfSailed({
          race,
          sailed: "green.400",
          unsailed: "blue.400",
          postponed: "blue.200",
          cancelled: useColorModeValue("gray.100", "gray.400"),
        })}
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
            <BottomLeft race={race} action={handleOnClick} />
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
