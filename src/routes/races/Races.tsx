import { Fragment, h } from "preact";
import { Box, Divider, Flex, Heading, Icon, IconButton, Spinner, Tooltip, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, doc } from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../util/firebase-config";
import useStorage from "../../hooks/useStorage";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import RaceItem from "./racesView/RaceItem";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import StartTheRaceModal from "./racesView/StartTheRaceModal";
import { route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { formatDate, formatTime } from "../../util/formatters";

export default function Races({ setHeaderTitle }) {
  setHeaderTitle("Races");
  const [seriesId, setSeriesId] = useStorage("seriesId");
  const [raceId, setRaceId] = useStorage("raceId", { initVal: "1" });
  const seriesRef = doc(db, "series", seriesId);
  const racesRef = collection(db, "series", seriesId, "races");
  const [races, racesLoading] = useCollection(racesRef);
  const [series, seriesLoading] = useDocumentData(seriesRef);
  const [user] = useAuthState(auth);

  const addRaceHandler = async () => {
    const docRef = await addDoc(racesRef, {
      name: "Race ",
      date: formatDate(new Date().toDateString()),
      time: new Date().toTimeString(),
      sailed: "0",
      raceid: "",
      _seriesid: seriesId,
      rank: "100",
      starts: [],
    });
    setRaceId(docRef.id);
    route("/races/edit");
  };

  return (
    <Fragment>
      <Box>
        <Flex justifyContent="space-between" alignItems="end">
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
        <Divider my={4} />

        <Box mt={2}>
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
