import { Fragment, h } from "preact";
import { route } from "preact-router";
import { Box, Divider, Flex, Heading, Icon, IconButton, Spinner, Tooltip } from "@chakra-ui/react";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import RaceItem from "./racesView/RaceItem";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

export default function Races({ setHeaderTitle }) {
  setHeaderTitle("Races");

  const [seriesId, _setSeriesId] = useStorage("seriesId");
  const [_raceId, setRaceId] = useStorage("raceId", { initVal: "1" });

  const racesRef = collection(db, "series", seriesId, "races");
  const [races, racesLoading] = useCollection(racesRef);

  const seriesRef = doc(db, "series", seriesId);
  const [series, _seriesLoading] = useDocumentData(seriesRef);

  // const [user] = useAuthState(auth);

  const addRaceHandler = async () => {
    const docRef = await addDoc(racesRef, {
      name: "Race ",
      date: new Date().toLocaleDateString("en-UK"),
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      sailed: "0",
      _seriesid: seriesId,
      starts: [],
    });
    setRaceId(docRef.id);
    route("/races/edit");
  };

  return (
    <Fragment>
      <Box>
        <Flex justifyContent="space-between" alignItems="end" px={4}>
          <FadeInSlideRight>
            <Heading as="h4" color="blue.400">
              {series && series.event}
            </Heading>
          </FadeInSlideRight>
          {/* Sub header buttons */}
          <FadeInSlideLeft>
            <Tooltip label="Add Race" hasArrow bg="blue.300" placement="bottom-start">
              <IconButton
                aria-label="add race"
                colorScheme="blue"
                variant="outline"
                boxShadow="md"
                _visited={{ color: "blue" }}
                onClick={addRaceHandler}
                icon={(<Icon as={AddToPhotosOutlinedIcon} />) as any}
              />
            </Tooltip>
          </FadeInSlideLeft>
        </Flex>
        <Divider my={4} border={4} shadow={"lg"} />

        <Box mt={2} my={4}>
          {/* Loading Spinner */}
          {racesLoading ? (
            <Flex justifyContent=" center" alignItems="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
          ) : (
            <Fragment>
              {races && races.docs.map((race) => <RaceItem key={race.id} race={race} setRaceId={setRaceId}></RaceItem>)}
            </Fragment>
          )}
        </Box>
      </Box>
    </Fragment>
  );
}
