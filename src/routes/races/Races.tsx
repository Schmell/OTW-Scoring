import { Box, Divider, Flex, Heading, Progress } from "@chakra-ui/react";
import { addDoc, collection, doc, orderBy, query } from "firebase/firestore";
import { Fragment, h } from "preact";
import { Link, route } from "preact-router";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import {
  FadeInSlideLeft,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import RaceItem from "./racesView/RaceItem";
import { useContext, useEffect } from "preact/hooks";
// import { RacesCtx } from "../../components/page/Routing";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ToolIconBtn from "../../components/generic/ToolIconBtn";

export default function Races(props) {
  const { setHeaderTitle, ...rest } = props;

  setHeaderTitle("Races");

  // const { racesCtx, setRacesCtx } = useContext(RacesCtx);
  const [racesArray, setRacesArray] = useStorage("racesArray");
  // const { raceCtx, setRaceCtx, racesCtx, setRacesCtx } = useContext(RacesCtx);

  const [seriesId, _setSeriesId] = useStorage("seriesId");
  const [_raceId, setRaceId] = useStorage("raceId", { initVal: "1" });

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const racesRef = collection(db, "series", seriesId, "races");
  const racesQ = query(racesRef, orderBy("name"), orderBy("date"));
  const [races, racesLoading] = useCollection(racesQ);
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  const seriesRef = doc(db, "series", seriesId);
  const [series, _seriesLoading] = useDocumentData(seriesRef);

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

  useEffect(() => {
    const raceIdArray = races?.docs.map((race) => {
      return race.id;
    });
    // console.log("raceIdArray: ", raceIdArray);
    setRacesArray(raceIdArray);
  }, [racesLoading]);

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
              <ToolIconBtn
                action={() => route("/series/edit")}
                label="Edit Series"
                icon={EditIcon}
              />
              <ToolIconBtn
                action={addRaceHandler}
                label="Add Race"
                icon={AddToPhotosOutlinedIcon}
              />
            </Flex>
          </FadeInSlideLeft>
        </Flex>

        <Divider my={4} border={4} shadow={"lg"} />

        <Box mt={2} my={4}>
          {/* Loading bar */}
          {racesLoading ? (
            <Progress size="xs" isIndeterminate top={-5} />
          ) : (
            <Fragment>
              {races &&
                races.docs.map((race) => (
                  <RaceItem
                    key={race.id}
                    race={race}
                    setRaceId={setRaceId}
                  ></RaceItem>
                ))}
            </Fragment>
          )}
        </Box>
      </Box>
    </Fragment>
  );
}
