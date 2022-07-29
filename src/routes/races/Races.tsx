import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import { Box, Divider, Flex, Heading, Icon, IconButton, Spinner, Tooltip } from "@chakra-ui/react";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import useStorage from "../../hooks/useStorage";
import RaceItem from "./racesView/RaceItem";
import { FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";

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
      <Box pb={4}>
        <Flex justifyContent="space-between" alignItems="end" px={6}>
          <FadeInSlideRight>
            <Heading as="h4" color="blue.400">
              <Link href="/series/edit">{series && series.event}</Link>
            </Heading>
          </FadeInSlideRight>
          {/* Sub header buttons */}
          <FadeInSlideLeft>
            <Flex gap={2}>
              <Tooltip label="Edit Series" hasArrow bg="blue.300" placement="bottom-start">
                <IconButton
                  aria-label="Edit Serie"
                  colorScheme="blue"
                  variant="outline"
                  boxShadow="md"
                  onClick={() => route("/series/edit")}
                  icon={(<Icon as={EditIcon} />) as any}
                />
              </Tooltip>
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
            </Flex>
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
